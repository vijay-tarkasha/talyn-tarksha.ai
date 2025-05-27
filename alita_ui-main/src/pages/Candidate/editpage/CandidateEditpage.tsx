import { Select } from "../../../template/mantineForm";

interface IProps {
  value: "Resumes" | "CSV";
  onChange: (val: "Resumes" | "CSV") => void;
}

const CandidateEditPage = ({ value, onChange }: IProps) => {
  const options = value === "Resumes" ? { CSV: "CSV" } : { Resumes: "Resumes" };

  return (
    <div className="w-full md:w-48">
      <Select
        attribute="resumeType"
        placeholder={value}
        value={value}
        onChange={(val) => onChange((val ?? "Resumes") as "Resumes" | "CSV")}
        options={options}
        nothingFoundMessage={"--No data available--"}
        className="w-full font-semibold"
      />
    </div>
  );
};

export default CandidateEditPage;
