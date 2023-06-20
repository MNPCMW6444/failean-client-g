import { Grid, TextField, Button, Typography, Paper } from "@mui/material";
import { useContext, useState, useEffect } from "react";
import { MainserverContext } from "@failean/mainserver-provider";
import { PromptName, WhiteModels } from "@failean/shared-types";
import PromptDialog from "./PromptDialog";
type WhiteIdea = WhiteModels.Data.Ideas.WhiteIdea;

interface PromptEditorProps {
  promptName: PromptName;
  idea: WhiteIdea | "NO IDEAS";
}

const PromptEditor = ({ idea, promptName }: PromptEditorProps) => {
  const mainserverContext = useContext(MainserverContext);
  const axiosInstance = mainserverContext?.axiosInstance;
  const [promptResultValue, setPromptResultValue] = useState<string>("");

  useEffect(() => {
    const fetchPromptResult = async () => {
      if (axiosInstance) {
        const { data } = await axiosInstance.post(
          "data/prompts/getPromptResult",
          {
            ideaId: idea !== "NO IDEAS" && idea?._id,
            promptName,
          }
        );

        setPromptResultValue(data.promptResult?.data || "");
      }
    };
    idea !== "NO IDEAS" && promptName !== "idea" && fetchPromptResult();
  }, [axiosInstance, idea, promptName]);

  const run = async () => {
    setPromptResultValue("running....");
    if (axiosInstance)
      axiosInstance
        .post("data/prompts/runAndGetPromptResult", {
          ideaId: idea !== "NO IDEAS" && idea?._id,
          promptName,
        })
        .then(({ data }) => {
          setPromptResultValue(data);
        });
  };

  const save = async () => {
    if (axiosInstance)
      axiosInstance
        .post("data/prompts/savePromptsResult", {
          ideaId: idea !== "NO IDEAS" && idea._id,
          promptName,
        })
        .then(({ data }) => {
          setPromptResultValue(data.response);
        });
  };

  return (
    <>
      <PromptDialog />
      <Paper sx={{ bgcolor: "#0000FF10" }}>
        <Grid container direction="column" rowSpacing={2} alignItems="center">
          <Grid item>
            <Typography variant="h6">
              {promptName
                .replace(/([A-Z])/g, " $1")
                .charAt(0)
                .toUpperCase() + promptName.replace(/([A-Z])/g, " $1").slice(1)}
            </Typography>
          </Grid>
          <Grid item>
            {idea === "NO IDEAS" ? (
              <Typography>
                Create your first Ideas to validate it with AI
              </Typography>
            ) : (
              <TextField
                multiline
                rows={24}
                variant="outlined"
                onChange={(e) => setPromptResultValue(e.target.value)}
                value={promptName === "idea" ? idea.idea : promptResultValue}
                disabled={promptName === "idea"}
              />
            )}
          </Grid>
          <Grid item container direction="column" alignItems="center">
            <Grid item>
              <Button
                disabled={
                  idea === "NO IDEAS" || !promptName || promptName === "idea"
                }
                onClick={() => !(!promptName || promptName === "idea") && run()}
              >
                run$
              </Button>
            </Grid>
            <Grid item>
              <Button
                disabled={
                  true ||
                  idea === "NO IDEAS" ||
                  !promptName ||
                  promptName === "idea"
                }
                onClick={() =>
                  !(!promptName || promptName === "idea") && save()
                }
              >
                override manual
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </>
  );
};

export default PromptEditor;
