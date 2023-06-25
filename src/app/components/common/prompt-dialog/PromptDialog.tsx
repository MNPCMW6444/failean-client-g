import {
  Grid,
  TextField,
  Button,
  Typography,
  useTheme,
  Box,
} from "@mui/material";
import {
  useContext,
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
  useCallback,
} from "react";
import { MainserverContext } from "@failean/mainserver-provider";
import { PromptName, WhiteModels } from "@failean/shared-types";
import { Dialog } from "@mui/material";
import { Feedback, Refresh, Save, Warning } from "@mui/icons-material";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import CloseIcon from "@mui/icons-material/Close";

type WhiteIdea = WhiteModels.Data.Ideas.WhiteIdea;

interface PromptDialogProps {
  promptName: PromptName;
  idea: WhiteIdea | "NO IDEAS";
  setOpenPrompt: Dispatch<SetStateAction<PromptName | "closed">>;
}

export const capitalize = (s: string) =>
  s
    .replace(/([A-Z])/g, " $1")
    .charAt(0)
    .toUpperCase() + s.replace(/([A-Z])/g, " $1").slice(1);

const PromptDialog = ({
  idea,
  promptName,
  setOpenPrompt,
}: PromptDialogProps) => {
  const mainserverContext = useContext(MainserverContext);
  const axiosInstance = mainserverContext?.axiosInstance;
  const [dbpromptResultValue, setdbPromptResultValue] = useState<string>("");
  const [promptResultValue, setPromptResultValue] = useState<string>("");

  const fetchPromptResult = useCallback(async () => {
    if (axiosInstance && idea !== "NO IDEAS" && promptName !== "idea") {
      const { data } = await axiosInstance.post(
        "data/prompts/getPromptResult",
        {
          ideaId: idea?._id,
          promptName,
        }
      );
      const res = data.promptResult?.data || "";

      setdbPromptResultValue(res);
      setPromptResultValue(res);
    }
  }, [axiosInstance, idea, promptName]);

  useEffect(() => {
    fetchPromptResult();
  }, [fetchPromptResult]);

  const run = async () => {
    if (axiosInstance)
      axiosInstance
        .post("data/prompts/runAndGetPromptResult", {
          ideaId: idea !== "NO IDEAS" && idea?._id,
          promptName,
        })
        .then(({ data }) => {});
  };

  const save = async () => {
    if (axiosInstance)
      axiosInstance
        .post("data/prompts/savePromptResult", {
          ideaId: idea !== "NO IDEAS" && idea._id,
          promptName,
          data: promptResultValue,
        })
        .then(({ data }) => {});
  };

  const handleClose = () => setOpenPrompt("closed");

  const theme = useTheme();

  return (
    <Dialog
      open
      maxWidth="xl"
      PaperProps={{ sx: { width: "70vw" } }}
      onClose={handleClose}
    >
      <DialogTitle>
        <Grid container width="100%" justifyContent="space-between">
          <Grid item>
            <Button variant="outlined" onClick={fetchPromptResult}>
              <Refresh sx={{ mr: 1 }} />
              Reload Last Saved Result
            </Button>
          </Grid>
          <Grid item>
            <Button
              onClick={handleClose}
              variant="outlined"
              sx={{ borderColor: "red", color: "red" }}
            >
              <CloseIcon sx={{ color: "red", mr: 1 }} />
              Close
            </Button>
          </Grid>
        </Grid>
      </DialogTitle>
      <DialogContent>
        <Grid
          container
          direction="column"
          rowSpacing={2}
          alignItems="center"
          wrap="nowrap"
        >
          <Grid item>
            <Typography variant="h5" color={theme.palette.primary.main}>
              {capitalize(promptName)}
            </Typography>
          </Grid>
          <Grid item paddingBottom="1%">
            <TextField
              multiline
              rows={18}
              variant="filled"
              sx={{ width: "50vw" }}
              onChange={(e) => setPromptResultValue(e.target.value)}
              value={
                idea === "NO IDEAS"
                  ? "Create your first Ideas to validate it with AI"
                  : promptName === "idea"
                  ? idea.idea
                  : promptResultValue
              }
              disabled={idea === "NO IDEAS" || promptName === "idea"}
            />
          </Grid>
          {promptResultValue !== dbpromptResultValue && (
            <Grid item paddingBottom="1%">
              <Box display="flex" alignItems="center">
                <Warning sx={{ color: "warning.main", mr: 1 }} />
                <Typography color="warning.main">unsaved changes</Typography>
              </Box>
            </Grid>
          )}
          <Grid item container justifyContent="center" columnSpacing={2}>
            <Grid item>
              <Button
                variant="outlined"
                disabled={
                  idea === "NO IDEAS" || !promptName || promptName === "idea"
                }
                onClick={() => !(!promptName || promptName === "idea") && run()}
              >
                <Refresh sx={{ mr: 1 }} />
                Run Prompt
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="outlined"
                disabled={
                  idea === "NO IDEAS" || !promptName || promptName === "idea"
                }
                onClick={() => !(!promptName || promptName === "idea") && run()}
              >
                <Feedback sx={{ mr: 1 }} /> Provide feedback and run prompt
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="outlined"
                disabled={
                  idea === "NO IDEAS" || !promptName || promptName === "idea"
                }
                onClick={() =>
                  !(!promptName || promptName === "idea") && save()
                }
              >
                <Save sx={{ mr: 1 }} /> Save Current Text as Prompt Result
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions></DialogActions>
    </Dialog>
  );
};

export default PromptDialog;
