// src/screens/Clg.tsx
import { Button } from "@components/Button";
import PageWrapper from "@components/PageWrapper";
import { NextSeo } from "next-seo";
import React, { useState } from "react";
import styled from "styled-components";

interface FormData {
  language: "french" | "english";
  companyName: string;
  jobTitle: string;
  jobDescription: string;
}

interface CompanySummary {
  name: string;
  industry: string;
  description: string;
  values: string[];
  recentNews: string;
}

interface CoverLetter {
  content: string;
  formatted: string;
}

type Step = "form" | "company-analysis" | "letter-generation" | "download";

const Clg: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<Step>("form");
  const [formData, setFormData] = useState<FormData>({
    language: "french",
    companyName: "",
    jobTitle: "",
    jobDescription: "",
  });
  const [companySummary, setCompanySummary] = useState<CompanySummary | null>(null);
  const [coverLetter, setCoverLetter] = useState<CoverLetter | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Step 1: Analyze company
      setCurrentStep("company-analysis");
      const companyResponse = await fetch("/api/clg/analyze-company", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName: formData.companyName,
          language: formData.language,
        }),
      });

      if (!companyResponse.ok) {
        throw new Error("Failed to analyze company");
      }

      const companyData = await companyResponse.json();
      setCompanySummary(companyData);

      // Step 2: Generate cover letter
      setCurrentStep("letter-generation");
      const letterResponse = await fetch("/api/clg/generate-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyData,
          jobTitle: formData.jobTitle,
          jobDescription: formData.jobDescription,
          language: formData.language,
        }),
      });

      if (!letterResponse.ok) {
        throw new Error("Failed to generate cover letter");
      }

      const letterData = await letterResponse.json();
      setCoverLetter(letterData);
      setCurrentStep("download");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setCurrentStep("form");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!coverLetter || !companySummary) return;

    try {
      setIsLoading(true);
      const response = await fetch("/api/clg/generate-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          coverLetter: coverLetter.content,
          companyName: formData.companyName,
          jobTitle: formData.jobTitle,
          language: formData.language,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate PDF");
      }

      const htmlContent = await response.text();
      
      // Open the HTML content in a new window for printing
      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(htmlContent);
        printWindow.document.close();
        
        // Focus the new window
        printWindow.focus();
        
        // Note: The HTML includes auto-print functionality
        // Users can use Ctrl+P to print to PDF manually if the auto-print doesn't work
      } else {
        throw new Error("Unable to open print window. Please allow popups for this site.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate PDF");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setCurrentStep("form");
    setFormData({ 
      language: "english", 
      companyName: "", 
      jobTitle: "", 
      jobDescription: "" 
    });
    setCompanySummary(null);
    setCoverLetter(null);
    setError(null);
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case "form":
        return "Cover Letter Generator";
      case "company-analysis":
        return "Analyzing Company...";
      case "letter-generation":
        return "Generating Cover Letter...";
      case "download":
        return "Your Cover Letter is Ready!";
      default:
        return "Cover Letter Generator";
    }
  };

  const isFormValid = () => {
    return formData.companyName.trim() && 
           formData.jobTitle.trim() && 
           formData.jobDescription.trim();
  };

  return (
    <PageWrapper forceReadableWidth>
      <NextSeo
        title="Cover Letter Generator - Development Tool"
        description="Generate personalized cover letters using AI - Development tool for Antoine Kingue"
      />

      <Container>
        <Header>
          <DevNotice>⚠️ Development Tool - Hidden Page</DevNotice>
          <h1>{getStepTitle()}</h1>
          <StepsIndicator>
            <Step $active={currentStep === "form"} $completed={currentStep !== "form"}>
              1
            </Step>
            <StepConnector />
            <Step $active={currentStep === "company-analysis"} $completed={["letter-generation", "download"].includes(currentStep)}>
              2
            </Step>
            <StepConnector />
            <Step $active={currentStep === "letter-generation"} $completed={currentStep === "download"}>
              3
            </Step>
            <StepConnector />
            <Step $active={currentStep === "download"} $completed={false}>
              4
            </Step>
          </StepsIndicator>
        </Header>

        {error && (
          <ErrorMessage>
            <strong>Error:</strong> {error}
            <Button onClick={resetForm} style={{ marginTop: "1rem" }}>
              Try Again
            </Button>
          </ErrorMessage>
        )}

        {currentStep === "form" && (
          <FormContainer>
            <form onSubmit={handleFormSubmit}>
              <FormGroup>
                <Label htmlFor="language">Language</Label>
                <Select
                  id="language"
                  value={formData.language}
                  onChange={(e) =>
                    setFormData({ ...formData, language: e.target.value as "french" | "english" })
                  }
                >
                  <option value="english">English</option>
                  <option value="french">Français</option>
                </Select>
              </FormGroup>

              <FormGroup>
                <Label htmlFor="companyName">Company Name *</Label>
                <Input
                  id="companyName"
                  type="text"
                  value={formData.companyName}
                  onChange={(e) =>
                    setFormData({ ...formData, companyName: e.target.value })
                  }
                  placeholder="Enter the company name..."
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="jobTitle">Job Title *</Label>
                <Input
                  id="jobTitle"
                  type="text"
                  value={formData.jobTitle}
                  onChange={(e) =>
                    setFormData({ ...formData, jobTitle: e.target.value })
                  }
                  placeholder="e.g. Senior Frontend Developer, Full Stack Engineer..."
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="jobDescription">Job Description *</Label>
                <TextArea
                  id="jobDescription"
                  value={formData.jobDescription}
                  onChange={(e) =>
                    setFormData({ ...formData, jobDescription: e.target.value })
                  }
                  placeholder="Paste the job description here..."
                  rows={8}
                  required
                />
                <HelperText>
                  Paste the complete job description to get the most personalized cover letter
                </HelperText>
              </FormGroup>

              <Button type="submit" disabled={!isFormValid() || isLoading}>
                {isLoading ? "Generating..." : "Generate Cover Letter"}
              </Button>
            </form>
          </FormContainer>
        )}

        {currentStep === "company-analysis" && (
          <LoadingContainer>
            <LoadingSpinner />
            <p>Researching {formData.companyName}...</p>
          </LoadingContainer>
        )}

        {currentStep === "letter-generation" && companySummary && (
          <LoadingContainer>
            <LoadingSpinner />
            <CompanySummaryCard>
              <h3>Company Analysis Complete</h3>
              <p><strong>Industry:</strong> {companySummary.industry}</p>
              <p><strong>Description:</strong> {companySummary.description}</p>
              {companySummary.values.length > 0 && (
                <p><strong>Values:</strong> {companySummary.values.join(", ")}</p>
              )}
            </CompanySummaryCard>
            <JobInfoCard>
              <h3>Job Information</h3>
              <p><strong>Position:</strong> {formData.jobTitle}</p>
              <p><strong>Requirements analyzed:</strong> ✓</p>
            </JobInfoCard>
            <p>Creating your personalized cover letter...</p>
          </LoadingContainer>
        )}

        {currentStep === "download" && coverLetter && companySummary && (
          <ResultContainer>
            <CompanySummaryCard>
              <h3>Company Analysis</h3>
              <p><strong>Industry:</strong> {companySummary.industry}</p>
              <p><strong>Description:</strong> {companySummary.description}</p>
              {companySummary.values.length > 0 && (
                <p><strong>Key Values:</strong> {companySummary.values.join(", ")}</p>
              )}
            </CompanySummaryCard>

            <JobInfoCard>
              <h3>Target Position</h3>
              <p><strong>Role:</strong> {formData.jobTitle}</p>
              <p><strong>Company:</strong> {formData.companyName}</p>
            </JobInfoCard>

            <CoverLetterPreview>
              <h3>Cover Letter Preview</h3>
              <LetterContent dangerouslySetInnerHTML={{ __html: coverLetter.formatted }} />
            </CoverLetterPreview>

            <ActionButtons>
              <Button onClick={handleDownloadPDF} disabled={isLoading}>
                {isLoading ? "Preparing..." : "Print to PDF"}
              </Button>
              <Button onClick={resetForm} style={{ backgroundColor: "transparent", border: "1px solid #30302b" }}>
                Generate Another
              </Button>
            </ActionButtons>
          </ResultContainer>
        )}
      </Container>
    </PageWrapper>
  );
};

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;

  h1 {
    margin-bottom: 2rem;
  }
`;

const DevNotice = styled.div`
  background-color: #2d1f1f;
  color: #ffb84d;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 1rem;
  border: 1px solid #4a3626;
`;

const StepsIndicator = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2rem;
`;

const Step = styled.div<{ $active: boolean; $completed: boolean }>`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
  background-color: ${({ $active, $completed }) =>
    $completed ? "#ffffe3" : $active ? "#30302b" : "transparent"};
  color: ${({ $active, $completed }) =>
    $completed ? "#10100e" : $active ? "#ffffe3" : "#bdbdb2"};
  border: 2px solid ${({ $active, $completed }) =>
    $completed ? "#ffffe3" : $active ? "#ffffe3" : "#30302b"};
  transition: all 0.3s ease;
`;

const StepConnector = styled.div`
  width: 40px;
  height: 2px;
  background-color: #30302b;
  margin: 0 8px;
`;

const FormContainer = styled.div`
  form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 600;
  color: #ffffe3;
`;

const Input = styled.input`
  padding: 12px 16px;
  border: 1px solid #30302b;
  border-radius: 8px;
  background-color: #1e1e1a;
  color: #ffffe3;
  font-size: 16px;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: #ffffe3;
  }

  &::placeholder {
    color: #bdbdb2;
  }
`;

const TextArea = styled.textarea`
  padding: 12px 16px;
  border: 1px solid #30302b;
  border-radius: 8px;
  background-color: #1e1e1a;
  color: #ffffe3;
  font-size: 16px;
  font-family: inherit;
  resize: vertical;
  min-height: 120px;

  &:focus {
    outline: none;
    border-color: #ffffe3;
  }

  &::placeholder {
    color: #bdbdb2;
  }
`;

const HelperText = styled.div`
  font-size: 14px;
  color: #bdbdb2;
  font-style: italic;
`;

const Select = styled.select`
  padding: 12px 16px;
  border: 1px solid #30302b;
  border-radius: 8px;
  background-color: #1e1e1a;
  color: #ffffe3;
  font-size: 16px;

  &:focus {
    outline: none;
    border-color: #ffffe3;
  }
`;

const LoadingContainer = styled.div`
  text-align: center;
  padding: 3rem 0;

  p {
    margin-top: 1rem;
    color: #bdbdb2;
  }
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid #30302b;
  border-top: 3px solid #ffffe3;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const CompanySummaryCard = styled.div`
  background-color: #1e1e1a;
  border: 1px solid #30302b;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;

  h3 {
    margin-top: 0;
    color: #ffffe3;
  }

  p {
    margin-bottom: 0.5rem;
    color: #bdbdb2;

    strong {
      color: #ffffe3;
    }
  }
`;

const JobInfoCard = styled.div`
  background-color: #1e1e1a;
  border: 1px solid #30302b;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;

  h3 {
    margin-top: 0;
    color: #ffffe3;
  }

  p {
    margin-bottom: 0.5rem;
    color: #bdbdb2;

    strong {
      color: #ffffe3;
    }
  }
`;

const ResultContainer = styled.div`
  margin-top: 2rem;
`;

const CoverLetterPreview = styled.div`
  background-color: #1e1e1a;
  border: 1px solid #30302b;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;

  h3 {
    margin-top: 0;
    color: #ffffe3;
  }
`;

const LetterContent = styled.div`
  color: #bdbdb2;

  p {
    margin-bottom: 1rem;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;

  @media (max-width: 600px) {
    flex-direction: column;
  }
`;

const ErrorMessage = styled.div`
  background-color: #2d1b1b;
  border: 1px solid #5a3a3a;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 2rem;
  color: #ff6b6b;
`;

export default Clg;