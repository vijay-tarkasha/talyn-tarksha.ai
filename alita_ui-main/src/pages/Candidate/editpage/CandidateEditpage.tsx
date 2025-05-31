import { Select } from "../../../template/mantineForm";

interface IProps {
  value: "Resume" | "CSV";
  onChange: (val: "Resume" | "CSV") => void;
}

const CandidateEditPage = ({ value, onChange }: IProps) => {
  const options = value === "Resume" ? { CSV: "CSV" } : { Resume: "Resume" };

  return (
    <div className="w-full md:w-48">
      <Select
        attribute="resumeType"
        placeholder={value}
        value={value}
        onChange={(val) => onChange((val ?? "Resume") as "Resume" | "CSV")}
        options={options}
        nothingFoundMessage={"--No data available--"}
        className="w-full font-semibold"
      />
    </div>
  );
};

export default CandidateEditPage;
