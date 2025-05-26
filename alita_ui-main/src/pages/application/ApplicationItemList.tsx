import { Accordion, Button, Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useTranslation } from "react-i18next";
import { MdModeEdit } from "react-icons/md";
import ProfileImage from "../../components/widget/ProfileImage";
import ApplicationEditPage from "./editPage/ApplicationEditPage";
// import CandidateEditPage from "./editPage/ApplicationEditPage";

const ApplicationItemList = (props: any) => {
  const [opened, { open, close }] = useDisclosure(false);
  const { t } = useTranslation();
  const btnTexts: any = t("buttonLabels", { returnObjects: true });
  const applicationTexts: any = t("application", { returnObjects: true });
  const candidate = props.data;

  const techStacks = candidate?.tech_stacks;

  return (
    <>
      <div className="">
        {candidate ? (
          <Accordion className="upload-accordion">
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
                    {applicationTexts?.input?.profile}
                  </div>
                  <div className="user-profile-value text-sm">
                    {techStacks?.join(", ") || "--"}
                  </div>
                </div>
                <div className="user-profile-field mt-3">
                  <div className="user-profile-label text-sm font-semibold">
                    {applicationTexts?.input?.email}
                  </div>
                  <div className="user-profile-value text-sm">
                    {candidate.email}
                  </div>
                </div>
                <div
                  className="acrd-btn-container flex items-center justify-center rounded-lg mt-3"
                  onClick={open}
                >
                  <div></div>
                  <Button
                    className="filled-button"
                    leftSection={<MdModeEdit className="button-icon" />}
                  >
                    {btnTexts.edit}
                  </Button>
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
        onClose={close}
        title={applicationTexts?.edit.title}
        centered
        className="candidate-modal"
        transitionProps={{ transition: "fade", duration: 200 }}
      >
        <ApplicationEditPage
          close={close}
          id={candidate.id}
          refreshTopic={props.refreshTopic}
        />
      </Modal>
    </>
  );
};

export default ApplicationItemList;
