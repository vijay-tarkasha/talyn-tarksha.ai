import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Select } from "../template/mantineForm";
import { PalmyraForm } from "@palmyralabs/rt-forms";
import { IoIosArrowDown } from "react-icons/io";

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const savedLanguage = localStorage.getItem("language") || "en";
  const [language, setLanguage] = useState<string>(savedLanguage);

  useEffect(() => {
    if (savedLanguage != language) {
      localStorage.setItem("language", language);
      i18n.changeLanguage(language);
    }
  }, [i18n, language]);

  const changeLanguage = (value: string) => {
    const formatValue = value.toLowerCase().slice(0, 2);
    setLanguage(formatValue);
  };

  return (
    <div className="language-switcher-container">
      <PalmyraForm>
        <Select
          variant="filled"
          defaultValue={savedLanguage}
          attribute="language"
          onChange={(value: any) => changeLanguage(value)}
          className="text-sm font-semibold text-gray-300"
          options={{
            en: "English",
            ta: "தமிழ்",
            hi: "हिन्दी",
            te: "తెలుగు ",
            ma:"മലയാളം",
            ka:"ಕನ್ನಡ ",
            mar:"मराठी",
            gu:"ગુજરાતી",
            // fr: "French",
          }}
          rightSection={
            <IoIosArrowDown
              className={`cursor-pointer transition-transform duration-300 ${
                open ? "rotate-180" : "rotate-0"
              }`}
              
            />
          }
          onDropdownOpen={() => setOpen(true)}
          onDropdownClose={() => setOpen(false)}
        />
      </PalmyraForm>
    </div>
  );
};

export default LanguageSwitcher;
