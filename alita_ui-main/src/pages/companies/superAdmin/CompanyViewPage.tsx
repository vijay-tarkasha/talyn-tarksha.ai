import { Button } from "@mantine/core";
import {
  FieldGroupContainer,
  ISaveForm,
  PalmyraEditForm,
} from "@palmyralabs/rt-forms";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { IoIosArrowDown } from "react-icons/io";
import { TbHome } from "react-icons/tb";
import "../CompanyPage.css";
import { IPageInput } from "../../../template/Types";
import { ServerLookup, TextField } from "../../../template/mantineForm";

const CompanyViewPage = (_props: IPageInput) => {
  const formRef = useRef<ISaveForm>(null);
  const [_isValid, setValid] = useState<boolean>(false);
  const { t } = useTranslation();
  const btnTexts: any = t("buttonLabels", { returnObjects: true });
  const companyTexts: any = t("company", { returnObjects: true });

  const apiEndpoint = "/job";

  return (
    <div className="">
      <div className="job-edit-container">
        <div className="form-header-container">
          <div className="header-container">
            <div className="icon-container">
              <TbHome className="header-icon" />
              <div>
                <span className="header-text">Genie Labs</span>
                <div className="sub-header-text">genielabs.com</div>
              </div>
            </div>
            <div className="header-btn-container">
              <Button
                className={"filled-button"}
                rightSection={<IoIosArrowDown className="button-icon" />}
              >
                {btnTexts.save}
              </Button>
            </div>
          </div>
        </div>
        <div>
          <PalmyraEditForm
            endPoint={apiEndpoint}
            ref={formRef}
            id=""
            onValidChange={setValid}
          >
            <FieldGroupContainer columns={2}>
              <TextField
                attribute="desc"
                label={companyTexts.input.addr}
                colspan={2}
                validRule={"string"}
                variant="filled"
                placeholder={companyTexts.input.descPh}
              />
              <ServerLookup
                attribute="city"
                label={companyTexts.input.city}
                displayAttribute="name"
                variant="filled"
                placeholder={companyTexts.input.cityPh}
                queryOptions={{ endPoint: apiEndpoint }}
                lookupOptions={{ idAttribute: "id", labelAttribute: "name" }}
              />
              <ServerLookup
                attribute="state"
                variant="filled"
                placeholder={companyTexts.input.statePh}
                displayAttribute="name"
                label={companyTexts.input.state}
                queryOptions={{ endPoint: apiEndpoint }}
                lookupOptions={{ idAttribute: "id", labelAttribute: "name" }}
              />
              <TextField
                attribute="zip"
                label={companyTexts.input.zip}
                validRule={"string"}
                variant="filled"
                placeholder={companyTexts.input.lobPh}
              />
              <ServerLookup
                attribute="country"
                label={companyTexts.input.country}
                displayAttribute="name"
                variant="filled"
                placeholder={companyTexts.input.countryPh}
                queryOptions={{ endPoint: apiEndpoint }}
                lookupOptions={{ idAttribute: "id", labelAttribute: "name" }}
              />
            </FieldGroupContainer>
          </PalmyraEditForm>
        </div>
      </div>
    </div>
  );
};

export default CompanyViewPage;
