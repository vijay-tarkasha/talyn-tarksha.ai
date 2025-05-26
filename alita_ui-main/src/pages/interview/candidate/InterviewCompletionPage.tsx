import { Paper, Text } from "@mantine/core"
import { FaCheckCircle } from "react-icons/fa";
import Footer from "../../../components/Footer";
import { useTranslation } from "react-i18next";

const InterviewCompletionPage = () => {
    const { t } = useTranslation();
    const interview: any = t("interview", { returnObjects: true })

    window.history.pushState(null, '', window.location.href);
    window.onpopstate = function () {
        window.history.pushState(null, '', window.location.href);
    };

    return (<>
        <div>
            <Paper p="lg" radius='md' withBorder bg="rgba(63, 248, 56, 0.15)" ta="center" m="sm">
                <div style={{ justifyContent: 'center', display: 'flex' }}><FaCheckCircle /></div>
                <Text fw={500} size="lg">
                    {interview?.intCom}
                </Text>
                <Text mt="xs" c="dimmed" size="sm">
                    {interview?.intComSub}
                </Text>
            </Paper>
        </div>
        <div>
            <Footer width='100%' />
        </div>
    </>
    )
}

export { InterviewCompletionPage }