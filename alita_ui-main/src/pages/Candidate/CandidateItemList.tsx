import { Accordion, Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useTranslation } from "react-i18next";
import { MdModeEdit } from "react-icons/md";
import ProfileImage from "../../components/widget/ProfileImage";
import { IoTrashOutline } from "react-icons/io5";
import ButtonSwitch from "../../components/widget/ButtonSwitch";
import CandidateId from "./editpage/CandidateId";
import {  useState } from "react";

const CandidateItemList = (props: any) => {
  const [opened, { open, close }] = useDisclosure(false);
  const [activeAccordion, setActiveAccordion] = useState<string | null>(null);
  const [buttonValue, setButtonValue] = useState("true");
  const { t } = useTranslation();
  const btnTexts: any = t("buttonLabels", { returnObjects: true });
  const candidatesTexts: any = t("candidates", { returnObjects: true });
  const candidate = props.data;

  const techStacks = candidate?.tech_stacks;

  const handleRemove = () => {
    console.log("Remove clicked for:", candidate.id);
  };

  const handleModalClose = () => {
    close();
    setActiveAccordion(null);
  };



  return (
    <>
      <div className="">
        {candidate ? (
          <Accordion
            className="upload-accordion"
            value={activeAccordion}
            onChange={setActiveAccordion}
          >
            <Accordion.Item key={candidate.id} value={`user-${candidate.id}`}>
              <Accordion.Control>
                <div className="acrd-header flex items-center justify-between pr-2">
                  <div className="flex items-center gap-3">
                    <div className="">
                      {/* <FaCircleUser className="user-icon text-2xl" /> */}
                      <ProfileImage
                        name={candidate.name}
                        id={candidate.id}
                        className={"profile_sm"}
                      />
                    </div>
                    <div className="align-top">
                      <div className="font-semibold text-sm">
                        {candidate.name}
                      </div>
                      <div className="user-prof-name text-xs">
                        {candidate?.jobPosting?.job_title}
                      </div>
                    </div>
                  </div>
                  {candidate.fitment_score && (
                    <div className="user-percentage-field px-2 py-1 rounded-full text-xs">
                      {candidate.fitment_score}%
                    </div>
                  )}
                </div>
              </Accordion.Control>
              <Accordion.Panel className="acrd-panel-detail">
                <div className="user-profile-field">
                  <div className="user-profile-label text-sm font-semibold">
                    {candidatesTexts?.input?.profile}
                  </div>
                  <div className="user-profile-value text-sm">
                    {techStacks?.join(", ") || "--"}
                  </div>
                </div>
                <div className="user-profile-field mt-3">
                  <div className="user-profile-label text-sm font-semibold">
                    {candidatesTexts?.input?.email}
                  </div>
                  <div className="user-profile-value text-sm">
                    {candidate.email}
                  </div>
                </div>
                {/* <div className="acrd-btn-container flex items-center justify-center gap-3 rounded-lg mt-3">
                  <div></div>
                  <Button
                    className="filled-button"
                    leftSection={
                      <IoTrashOutline className="button-icon" />
                    }
                    onClick={handleRemove}
                  >
                    {btnTexts.removed}
                  </Button>
                  <Button
                    className="filled-button"
                    leftSection={<MdModeEdit className="button-icon" />}
                    onClick={open}
                  >
                    {btnTexts.edit}
                  </Button>
                </div> */}
                <div className="items-center gap-4 py-2 md:flex">
                  <div className="w-full">
                    <ButtonSwitch
                      defaultValue={buttonValue}
                      options={{
                        true: (
                          <div className="flex items-center gap-2 ">
                            <IoTrashOutline />
                            {btnTexts?.removed}
                          </div>
                        ),
                        false: (
                          <div className="flex items-center gap-2">
                            <MdModeEdit />
                            {btnTexts?.edit}
                          </div>
                        ),
                      }}
                      onSelectionChange={(value) => {
                        setButtonValue(value); // update local state
                        if (value != "true") {
                          open();
                        } else {
                          handleRemove();
                        }
                      }}
                    />
                  </div>
                </div>
              </Accordion.Panel>
            </Accordion.Item>
          </Accordion>
        ) : (
          <div className="acrd-candidates-no-data text-center m-2">
            No Data Available
          </div>
        )}
      </div>

      <Modal
        opened={opened}
        onClose={handleModalClose}
        title={candidatesTexts?.edit.title}
        centered
        className="candidate-modal"
        transitionProps={{ transition: "fade", duration: 200 }}
      >
        <CandidateId
          close={handleModalClose}
          id={candidate.id}
          refreshTopic={props.refreshTopic}
        />
      </Modal>
    </>
  );
};

export default CandidateItemList;
