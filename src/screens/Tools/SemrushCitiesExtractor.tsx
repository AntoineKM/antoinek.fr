import Link from "@components/Link";
import PageWrapper from "@components/PageWrapper";
import Head from "next/head";
import Papa from "papaparse";
import React from "react";
import cities from "src/data/cities";

const SemrushCitiesExtractor = () => {
  const cityNames = cities.map((city) => city.toLowerCase());

  const [error, setError] = React.useState<string>();
  const [progress, setProgress] = React.useState<number>();
  const [progressMax, setProgressMax] = React.useState<number>(100);

  const handleFileChange = async (e) => {
    const f = e.target.files[0];

    if (!f || !f.name) {
      setError("Please select a file");
    } else {
      const data = Papa.parse(await f.text()).data;
      setProgress(0);
      setProgressMax(data.length * cityNames.length);

      const result = await Promise.all(
        data.map(async (item) => {
          const hasCityInName = await Promise.all(
            cityNames.map(async (cityName) => {
              const keyword = item[0]?.toLowerCase();
              const cityRegExp = new RegExp(`\\b${cityName}\\b`, "i");
              setProgress((prev) => prev + 1);
              return cityRegExp.test(keyword);
            }),
          );

          return {
            category: hasCityInName.some((match) => match) ? "City" : "",
            ...item,
          };
        }),
      );

      const csv = Papa.unparse(result);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `${f.name}-cities.csv`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setProgress(undefined);
    }
  };

  return (
    <PageWrapper>
      <Head>
        <title>{"semrush cities extractor | Antoine Kingue"}</title>
      </Head>
      <h1>{"📤 semrush cities extractor"}</h1>
      <p>
        {
          "Detect if your semrush keywords contain a city name, if you are looking for a xlxs to csv converter, you can use "
        }
        <Link href={"https://convertio.co/xlsx-csv/"}>{"this tool"}</Link>
        {"."}
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
      {progress && <progress value={progress} max={progressMax} />}
    </PageWrapper>
  );
};

export default SemrushCitiesExtractor;
