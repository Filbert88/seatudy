// components/Instructions.tsx
import { renderMarkdown } from "../../../lib/markdown";

interface InstructionsProps {
  children: string;
}

const Instructions: React.FC<InstructionsProps> = ({ children }) => {
  const htmlContent = renderMarkdown(children);

  return (
    <div className="font-nunito font-regular text-justify max-w-5xl">
      <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
    </div>
  );
};

export default Instructions;
