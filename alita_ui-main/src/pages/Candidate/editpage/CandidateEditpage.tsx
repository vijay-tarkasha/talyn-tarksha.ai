// import { useState } from "react";
// import { TextInput } from "@mantine/core";
import { Select } from "../../../template/mantineForm";

// interface IProps {
//   value: string;
//   onChange: (val: string) => void;
// }
interface IProps {
  value: "resumes" | "csv";
  onChange: (val: "resumes" | "csv") => void;
}

const CandidateEditPage = ({ value, onChange }: IProps) => {
  // const [value, setValue] = useState("resumes"); // Start la resumes selected

  const options = value === "resumes" ? { csv: "CSV" } : { resumes: "Resumes" };

  return (
    <div className="w-full md:w-48">
      {/* <TextInput
        name="candidateId"
        label="Candidate ID"
        required
        onChange={(event) => console.log(event.currentTarget.value)}
      /> */}
      <Select
        attribute="resumeType"
        placeholder={value}
        value={value}
        // onChange={(val) => onChange(val ?? "")}
        onChange={(val) => onChange((val ?? "resumes") as "resumes" | "csv")}
        options={options}
        nothingFoundMessage={"--No data available--"}
        className="w-full font-semibold"
      />
    </div>
  );
};

export default CandidateEditPage;
