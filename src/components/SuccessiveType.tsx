import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import useSound from "use-sound";

const Word = ({ word }: { word: string }) => {
  const [filled, setFilled] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setFilled(true);
    }, 65);
  }, []);

  return <WordSC $filled={filled}>{word}</WordSC>;
};

interface Props {
  words: string;
  userSkipped?: boolean;
  onEnd?: () => void;
}

const SuccessiveType: React.FC<Props> = ({
  words,
  userSkipped,
  onEnd,
}: Props) => {
  const [play] = useSound("/static/sounds/type.ogg");

  const [index, setIndex] = useState(0);

  const splitWords: string[] = useMemo(() => words.split(" "), [words]);
  const shownWords: string[] = useMemo(
    () => splitWords.slice(0, index + 1),
    [splitWords, index],
  );

  useEffect(() => {
    if (index === splitWords.length - 1) {
      if (onEnd)
        setTimeout(() => {
          onEnd();
        }, 1800);

      return;
    }

    const currentWord = splitWords[index];

    setTimeout(
      () => {
        setIndex(index + 1);
      },
      currentWord.length * (Math.E * 20) +
        (currentWord[currentWord.length - 1] === "." ? 500 : 0),
    );
  }, [index, splitWords, onEnd]);

  useEffect(() => {
    if (!userSkipped) play();
  }, [index, play, userSkipped]);

  return (
    <Container>
      {shownWords.map((word: string, idx) => (
        <Word key={idx} word={word} />
      ))}
    </Container>
  );
};

const Container = styled.div`
  text-align: left;
  color: #ffffe3;
  font-size: 20pt;
`;

const WordSC = styled.span<{ $filled: boolean }>`
  color: ${({ $filled }) => ($filled ? "#bdbdb2" : "#ffffe3")};
  margin-right: 4pt;
  transition: color 2s ease;
  display: inline-block;
`;

export default SuccessiveType;
