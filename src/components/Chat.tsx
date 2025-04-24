import { useChat } from "@ai-sdk/react";
import { marked } from "marked";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";

const SUGGESTED_MESSAGES = [
  "What is your experience?",
  "What technologies do you use?",
  "What are your current projects?",
  "How can I contact you?",
];

const Chat = () => {
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsContainerRef = useRef<HTMLDivElement>(null);
  const [lastMessageTime, setLastMessageTime] = useState(0);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [cooldownRemaining, setCooldownRemaining] = useState(0);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    append,
  } = useChat();

  const RATE_LIMIT_COOLDOWN = 3000;

  // Check scroll position of suggestions container
  const checkScrollPosition = () => {
    if (!suggestionsContainerRef.current) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = suggestionsContainerRef.current;
    
    // Show left arrow if scrolled right
    setShowLeftArrow(scrollLeft > 0);
    
    // Show right arrow if there's more content to scroll to
    setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 10); // Small buffer
  };

  // Scroll suggestion container left
  const scrollSuggestionsLeft = () => {
    if (!suggestionsContainerRef.current) return;
    suggestionsContainerRef.current.scrollBy({ left: -200, behavior: "smooth" });
  };

  // Scroll suggestion container right
  const scrollSuggestionsRight = () => {
    if (!suggestionsContainerRef.current) return;
    suggestionsContainerRef.current.scrollBy({ left: 200, behavior: "smooth" });
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (inputRef.current && isChatOpen) {
        inputRef.current.focus();
      }
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [messages, isChatOpen]);

  useEffect(() => {
    if (isChatOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isChatOpen]);

  useEffect(() => {
    marked.setOptions({
      breaks: true,
      gfm: true,
    });
  }, []);

  // Setup scroll event listeners for suggestions
  useEffect(() => {
    const container = suggestionsContainerRef.current;
    if (container) {
      // Initial check
      checkScrollPosition();
      
      // Add event listener
      container.addEventListener("scroll", checkScrollPosition);
      
      // Clean up
      return () => {
        container.removeEventListener("scroll", checkScrollPosition);
      };
    }
  }, []);

  // Check scroll on window resize and when component mounts
  useEffect(() => {
    // Initial check after component mounts and content is rendered
    setTimeout(checkScrollPosition, 100);
    
    window.addEventListener("resize", checkScrollPosition);
    
    return () => {
      window.removeEventListener("resize", checkScrollPosition);
    };
  }, []);

  const renderMarkdown = (content: string) => {
    try {
      const parsed = marked.parse(content);

      if (parsed instanceof Promise) {
        return { __html: content };
      }

      // eslint-disable-next-line prettier/prettier
      const html = (parsed as string).replace(/<a\s+(?:[^>]*?\s+)?href=([^>]*)>/gi, 
        // eslint-disable-next-line quotes
        '<a href=$1 target="_blank" rel="noopener noreferrer">',
      );

      return { __html: html };
    } catch (error) {
      console.error("Error parsing markdown:", error);
      return { __html: content };
    }
  };

  const handleRateLimitedSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isLoading) {
      return;
    }

    const now = Date.now();
    const timeSinceLastMessage = now - lastMessageTime;

    if (timeSinceLastMessage < RATE_LIMIT_COOLDOWN) {
      const remaining = Math.ceil(
        (RATE_LIMIT_COOLDOWN - timeSinceLastMessage) / 1000,
      );
      setCooldownRemaining(remaining);

      const timer = setInterval(() => {
        setCooldownRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return;
    }

    setLastMessageTime(now);
    handleSubmit(event);
  };

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  const handleSuggestionClick = (text: string) => {
    if (isLoading) return;

    append({
      role: "user",
      content: text,
    });

    setLastMessageTime(Date.now());
  };

  const showSuggestions = messages.length === 0;

  const reversedMessages = [...messages].reverse();

  return (
    <>
      {!isChatOpen && (
        <ChatToggleButton onClick={toggleChat}>{"Chat"}</ChatToggleButton>
      )}

      <ChatContainer $isOpen={isChatOpen}>
        <ChatHeader>
          <h3>{"Ask me anything"}</h3>
          <CloseButton onClick={toggleChat}>{"✕"}</CloseButton>
        </ChatHeader>

        <DesktopMessagesContainer ref={chatContainerRef}>
          {messages.length === 0 ? (
            <WelcomeMessage>
              <p>
                {
                  "Ask me anything about Antoine, his projects, skills, or experiences."
                }
              </p>
            </WelcomeMessage>
          ) : (
            messages.map((m) => (
              <Message key={m.id}>
                <MessageSender>
                  {m.role === "user" ? "You" : "Antoine AI"}
                </MessageSender>
                <MessageContent
                  dangerouslySetInnerHTML={renderMarkdown(m.content)}
                />
              </Message>
            ))
          )}
          {isLoading &&
            (!messages.length ||
              messages[messages.length - 1].role !== "assistant" ||
              messages[messages.length - 1].content === "") && (
              <TypingIndicator>{"thinking..."}</TypingIndicator>
            )}
          {cooldownRemaining > 0 && (
            <RateLimitMessage>
              {`Please wait ${cooldownRemaining}s before sending another message`}
            </RateLimitMessage>
          )}
        </DesktopMessagesContainer>

        {/* Mobile-specific messages container that shows messages from bottom up */}
        <MobileMessagesContainer>
          {cooldownRemaining > 0 && (
            <RateLimitMessage>
              {`Please wait ${cooldownRemaining}s before sending another message`}
            </RateLimitMessage>
          )}
          {isLoading &&
            (!messages.length ||
              messages[messages.length - 1].role !== "assistant" ||
              messages[messages.length - 1].content === "") && (
              <TypingIndicator>{"thinking..."}</TypingIndicator>
            )}
          {messages.length === 0 ? (
            <WelcomeMessage>
              <p>
                {
                  "Ask me anything about Antoine, his projects, skills, or experiences."
                }
              </p>
            </WelcomeMessage>
          ) : (
            reversedMessages.slice(0, 3).map((m) => (
              <Message key={m.id}>
                <MessageSender>
                  {m.role === "user" ? "You" : "Antoine AI"}
                </MessageSender>
                <MessageContent
                  dangerouslySetInnerHTML={renderMarkdown(m.content)}
                />
              </Message>
            ))
          )}
        </MobileMessagesContainer>

        {showSuggestions && (
          <SuggestionsWrapper>
            {showLeftArrow && (
              <ScrollArrow onClick={scrollSuggestionsLeft} position="left">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </ScrollArrow>
            )}
            
            <SuggestionsContainer ref={suggestionsContainerRef}>
              {SUGGESTED_MESSAGES.map((suggestion, index) => (
                <SuggestionChip
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  disabled={isLoading}
                  type={"button"}
                >
                  {suggestion}
                </SuggestionChip>
              ))}
            </SuggestionsContainer>
            
            {showRightArrow && (
              <ScrollArrow onClick={scrollSuggestionsRight} position="right">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </ScrollArrow>
            )}
          </SuggestionsWrapper>
        )}

        <form onSubmit={handleRateLimitedSubmit}>
          <ChatInputContainer>
            <ChatInput
              ref={inputRef}
              value={input}
              onChange={handleInputChange}
              placeholder={"Ask me anything..."}
              autoComplete={"off"}
              autoFocus
            />
            <SendButton type={"submit"} disabled={!input.trim()}>
              {"Send"}
            </SendButton>
          </ChatInputContainer>
          <DisclaimerText>
            {"Antoine AI is doing its best but may occasionally make mistakes."}
          </DisclaimerText>
        </form>
      </ChatContainer>
    </>
  );
};

const ChatToggleButton = styled.button`
  display: none;
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: 8px 12px;
  border-radius: 4px;
  background-color: #1e1e1a;
  color: #ffffe3;
  border: 1px solid #30302b;
  cursor: pointer;
  z-index: 51;
  font-weight: 500;
  font-size: 0.9rem;
  transition: all 0.2s ease;

  &:hover {
    background-color: #30302b;
  }

  @media (max-width: 1200px) {
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

const CloseButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: #ffffe3;
  cursor: pointer;
  font-size: 1.2rem;
  padding: 0;
  margin-left: auto;

  @media (max-width: 1200px) {
    display: block;
  }
`;

const ChatContainer = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  right: 0;
  width: 350px;
  height: 100%;
  background-color: #10100e;
  border-left: 1px solid #30302b;
  display: flex;
  flex-direction: column;
  z-index: 50;
  transition: transform 0.3s ease;

  @media (max-width: 1200px) {
    transform: ${({ $isOpen }) =>
      $isOpen ? "translateX(0)" : "translateX(100%)"};
    width: 100%;
    max-width: 450px;
    box-shadow: -5px 0 15px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 500px) {
    width: 100%;
  }
`;

const ChatHeader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  position: relative;

  /* Gradient shadow effect for smooth scroll transition */
  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 20px;
    background: linear-gradient(
      to bottom,
      rgba(16, 16, 14, 0) 0%,
      rgba(16, 16, 14, 1) 100%
    );
    pointer-events: none;
  }

  h3 {
    margin: 0;
    color: #ffffe3;
    font-size: 1rem;
    font-weight: 500;
  }
`;

// Desktop messages container that scrolls naturally
const DesktopMessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  position: relative;
  mask-image: linear-gradient(
    to bottom,
    transparent 0%,
    black 20px,
    black calc(100% - 20px),
    transparent 100%
  );

  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 7px;
    height: 7px;
  }

  &::-webkit-scrollbar-track {
    background: #10100e;
  }

  &::-webkit-scrollbar-thumb {
    border: 1px solid #30302b;
    border-radius: 10px;
    height: 10px;
  }

  /* Hide on mobile */
  @media (max-width: 1200px) {
    display: none;
  }
`;

const MobileMessagesContainer = styled.div`
  display: none;
  flex-direction: column-reverse;
  padding: 1rem;
  gap: 0.5rem;
  margin-top: auto;

  /* Only show on mobile */
  @media (max-width: 1200px) {
    display: flex;
    flex: 1;
  }
`;

// New wrapper for suggestions with scroll arrows
const SuggestionsWrapper = styled.div`
  position: relative;
  width: 100%;
`;

// Modified suggestions container
const SuggestionsContainer = styled.div`
  display: flex;
  padding: 0.75rem;
  justify-content: flex-start;
  background-color: #10100e;
  border-top: 1px solid #30302b;
  overflow-x: auto;
  white-space: nowrap;
  -webkit-overflow-scrolling: touch;
  scroll-behavior: smooth;

  /* Hide scrollbar for Chrome, Safari and Opera */
  &::-webkit-scrollbar {
    display: none;
  }

  /* Hide scrollbar for IE, Edge and Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */

  /* Add space between items */
  & > button {
    margin-right: 0.5rem;

    &:last-child {
      margin-right: 0;
    }
  }
`;

// Amélioré avec SVG pour un meilleur centrage
const ScrollArrow = styled.button<{ position: 'left' | 'right' }>`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  ${({ position }) => position === 'left' ? 'left: 5px;' : 'right: 5px;'}
  z-index: 5;
  background-color: #1e1e1a;
  color: #bdbdb2;
  border: 1px solid #30302b;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 0; /* Supprime tout padding par défaut */

  &:hover {
    background-color: #30302b;
    color: #ffffe3;
  }
  
  /* SVG à l'intérieur du bouton */
  svg {
    width: 12px;
    height: 12px;
    display: block; /* Élimine l'espace supplémentaire */
  }
`;

const SuggestionChip = styled.button`
  background-color: #1e1e1a;
  color: #bdbdb2;
  border: 1px solid #30302b;
  border-radius: 15px;
  padding: 0.4rem 0.8rem;
  font-size: 0.8rem;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s ease;

  &:hover {
    background-color: #30302b;
    color: #ffffe3;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const Message = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 0.5rem;
`;

const MessageSender = styled.div`
  font-weight: 600;
  color: #ffffe3;
  font-size: 0.8rem;
  margin-bottom: 0.25rem;
`;

const MessageContent = styled.div`
  color: #bdbdb2;
  text-align: left;
  font-size: 0.9rem;

  /* Markdown styles */
  a {
    color: #ffffe3;
    text-decoration: underline;

    &:hover {
      opacity: 0.8;
    }
  }

  p {
    margin: 0.5rem 0;

    &:first-child {
      margin-top: 0;
    }

    &:last-child {
      margin-bottom: 0;
    }
  }

  code {
    background-color: #1e1e1a;
    padding: 0.2rem 0.4rem;
    border-radius: 3px;
    font-family: monospace;
    font-size: 0.85em;
  }

  pre {
    background-color: #1e1e1a;
    padding: 0.5rem;
    border-radius: 4px;
    overflow-x: auto;
    margin: 0.5rem 0;

    code {
      background-color: transparent;
      padding: 0;
      border-radius: 0;
    }
  }

  /* Markdown list styling */
  ul,
  ol {
    margin-top: 0.1rem;
    margin-bottom: 0.1rem;
    padding-left: 1.5rem;
  }

  li {
    margin: 0;
    padding: 0;
    line-height: 1;
  }

  blockquote {
    border-left: 3px solid #30302b;
    margin: 0.5rem 0;
    padding-left: 1rem;
    color: #8e8e83;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin: 0.5rem 0;
    color: #ffffe3;
  }

  hr {
    border: none;
    border-top: 1px solid #30302b;
    margin: 0.5rem 0;
  }

  table {
    border-collapse: collapse;
    width: 100%;
    margin: 0.5rem 0;

    th,
    td {
      border: 1px solid #30302b;
      padding: 0.3rem;
      text-align: left;
    }

    th {
      background-color: #1e1e1a;
    }
  }
`;

const TypingIndicator = styled.div`
  padding: 0.5rem;
  color: #bdbdb2;
  font-style: italic;
  text-align: left;
  font-size: 0.8rem;
`;

const ChatInputContainer = styled.div`
  display: flex;
  padding: 1rem 1rem 0;
  position: relative;
  background-color: #10100e;

  /* Gradient shadow effect for smooth scroll transition */
  &::before {
    content: "";
    position: absolute;
    top: -20px;
    left: 0;
    width: 100%;
    height: 20px;
    background: linear-gradient(
      to top,
      rgba(16, 16, 14, 1) 0%,
      rgba(16, 16, 14, 0) 100%
    );
    pointer-events: none;
  }
`;

const ChatInput = styled.input`
  flex: 1;
  padding: 0.75rem;
  background-color: #1e1e1a;
  border: 1px solid #30302b;
  border-radius: 10px 0 0 10px;
  color: #ffffe3;
  outline: none;

  &:focus {
    border-color: #bdbdb2;
  }

  &::placeholder {
    color: #505050;
  }
`;

const SendButton = styled.button`
  padding: 0.75rem 1rem;
  background-color: #ffffe3;
  color: #10100e;
  border: 1px solid #30302b;
  border-left: none;
  border-radius: 0 10px 10px 0;
  cursor: pointer;
  font-weight: 600;

  &:disabled {
    background-color: #30302b;
    color: #505050;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    background-color: #bdbdb2;
  }
`;

const WelcomeMessage = styled.div`
  text-align: center;

  p {
    color: #bdbdb2;
    margin-bottom: 0;
    font-style: italic;
    font-size: 0.9rem;
  }
`;

const RateLimitMessage = styled.div`
  padding: 0.5rem;
  color: #ff9977;
  font-style: italic;
  text-align: center;
  font-size: 0.8rem;
  border-top: 1px solid #30302b;
  border-bottom: 1px solid #30302b;
  margin: 0.5rem 0;
`;

const DisclaimerText = styled.div`
  text-align: center;
  color: #6c6c63;
  font-size: 0.7rem;
  font-style: italic;
  padding: 0.5rem 0.5rem 1rem;
`;

export default Chat;
