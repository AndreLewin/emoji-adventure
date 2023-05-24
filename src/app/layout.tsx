import { MantineProvider } from "@mantine/core";
import "../styles/globals.css";
import "animate.css";
import { ModalsProvider } from "@mantine/modals";
import { NotificationsProvider } from "@mantine/notifications";
import PromptModal from "../components/modals/PromptModal";
import AlertModal from "../components/modals/AlertModal";
import ConfirmModal from "../components/modals/ConfirmModal";
import MultipleChoiceModal from "../components/modals/MultipleChoiceModal";

export const metadata = {
  title: 'Loading...',
  description: 'Adventure created with Emoji Adventure',
  icons: "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>😀</text></svg>"
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html>
      <body>
        <MantineProvider
          withGlobalStyles
          withNormalizeCSS
          theme={{
            /** Put your mantine theme override here */
            colorScheme: 'light',
          }}
        >
          <ModalsProvider modals={{ alertModal: AlertModal, confirmModal: ConfirmModal, multipleChoiceModal: MultipleChoiceModal, promptModal: PromptModal }}>
            <NotificationsProvider>
              {children}
            </NotificationsProvider>
          </ModalsProvider>
        </MantineProvider>
      </body>
    </html>
  )
}
