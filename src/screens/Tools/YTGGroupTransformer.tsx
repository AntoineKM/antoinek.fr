import PageWrapper from "@components/PageWrapper";
import Head from "next/head";
import Papa from "papaparse";
import React from "react";
import styled from "styled-components";
import { useCopyToClipboard } from "usehooks-ts";

const YTGGroupTransformer = () => {
  const [csvData, setCsvData] = React.useState([]);
  const [error, setError] = React.useState(null);
  const [copiedValue, copy] = useCopyToClipboard();

  const handleFileChange = (e) => {
    const f = e.target.files[0];

    if (!f || !f.name) {
      setError("Please select a file");
    } else {
      Papa.parse(f, {
        header: true,
        complete: (results) => {
          setCsvData(results.data);
        },
      });
    }
  };

  return (
    <PageWrapper>
      <Head>
        <title>{"yourtextguru group transformer | Antoine Kingue"}</title>
      </Head>
      <h1>{"✏️ yourtextguru group transformer"}</h1>
      <p>
        {
          "One of our daily tasks was to extract all keywords from each query in a YourTextGuru group, which means we would convert a YourTextGuru group into a list of keywords by query."
        }
      </p>
      <form onSubmit={(e) => e.preventDefault()}>
        <label>
          <input
            type={"file"}
            name={"file"}
            accept={".csv"}
            onChange={handleFileChange}
          />
        </label>
        {error && <p>{error}</p>}
      </form>

      {csvData &&
        csvData.length > 0 &&
        csvData.map((row, i) => {
          const text = `${row["1 mot"]?.replace(/\n/g, ", ")}, ${row[
            "2 mots"
          ]?.replace(/\n/g, ", ")}, ${row["3 mots"]?.replace(/\n/g, ", ")}`;

          if (
            !row["1 mot"] ||
            !row["2 mots"] ||
            !row["3 mots"] ||
            !row.requete
          ) {
            return null;
          }

          return (
            <div key={i} id={row.id}>
              <Row>
                <h2>{row.requete}</h2>
                <Copy onClick={() => copy(text)}>{"copy"}</Copy>{" "}
                {copiedValue === text ? "✅" : "📋"}
              </Row>
              <p>{text}</p>
            </div>
          );
        })}
    </PageWrapper>
  );
};

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Copy = styled.u`
  cursor: pointer;
`;

export default YTGGroupTransformer;
