import { useChat } from "@ai-sdk/react";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";

const Chat = () => {
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [lastMessageTime, setLastMessageTime] = useState(0);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat();

  const RATE_LIMIT_COOLDOWN = 3000; // 3 seconds cooldown between messages

  // Auto-scroll to the bottom of the chat when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Make sure input gets focus back after sending a message or opening chat
  useEffect(() => {
    // Small delay to ensure the DOM is updated
    const timeoutId = setTimeout(() => {
      if (inputRef.current && isChatOpen) {
        inputRef.current.focus();
      }
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [messages, isChatOpen]);

  // Focus input when chat is opened
  useEffect(() => {
    if (isChatOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isChatOpen]);

  // Handle rate limiting
  const handleRateLimitedSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const now = Date.now();
    if (now - lastMessageTime < RATE_LIMIT_COOLDOWN) {
      setIsRateLimited(true);

      // Reset rate limit after cooldown
      setTimeout(
        () => {
          setIsRateLimited(false);
        },
        RATE_LIMIT_COOLDOWN - (now - lastMessageTime),
      );

      return;
    }

    setLastMessageTime(now);
    handleSubmit(event);
  };

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <>
      {/* Chat toggle button for smaller screens - only shown when chat is closed */}
      {!isChatOpen && (
        <ChatToggleButton onClick={toggleChat}>{"Chat"}</ChatToggleButton>
      )}

      <ChatContainer $isOpen={isChatOpen}>
        <ChatHeader>
          <h3>{"Ask me anything"}</h3>
          <CloseButton onClick={toggleChat}>{"✕"}</CloseButton>
        </ChatHeader>

        <MessagesContainer ref={chatContainerRef}>
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
                <MessageContent>{m.content}</MessageContent>
              </Message>
            ))
          )}
          {isLoading &&
            (!messages.length ||
              messages[messages.length - 1].role !== "assistant" ||
              messages[messages.length - 1].content === "") && (
              <TypingIndicator>{"thinking..."}</TypingIndicator>
            )}
          {isRateLimited && (
            <RateLimitMessage>
              {"Please wait a moment before sending another message"}
            </RateLimitMessage>
          )}
        </MessagesContainer>

        <form onSubmit={handleRateLimitedSubmit}>
          <ChatInputContainer>
            <ChatInput
              ref={inputRef}
              value={input}
              onChange={handleInputChange}
              placeholder={"Ask me anything..."}
              autoComplete={"off"}
              autoFocus
              disabled={isLoading || isRateLimited}
            />
            <SendButton
              type={"submit"}
              disabled={isLoading || isRateLimited || !input.trim()}
            >
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

// Styled Components
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
  height: 100vh;
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

const MessagesContainer = styled.div`
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
  white-space: pre-wrap;
  text-align: left;
  font-size: 0.9rem;
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
