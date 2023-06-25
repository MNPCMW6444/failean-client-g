import React, { useState, useEffect } from "react";
import Checkbox from "@mui/material/Checkbox";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IdeaSelector from "../../common/IdeaSelector";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

export default function RunCritiq() {
  const [value, setValue] = useState("");
  const [Category, setCategory] = useState("");
  const [ideaId, setIdeaId] = useState<string>("");
  const [checkedState, setCheckedState] = useState({
    angel: false,
    vc: false,
    customer: false,
  });

  const handleCategoryChange = (event: SelectChangeEvent) => {
    setCategory(event.target.value);
  };
  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    setDisabled(!ideaId);
  }, [ideaId]);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCheckedState({
      ...checkedState,
      [event.target.name]: event.target.checked,
    });
  };

  const handleChange = (event: React.ChangeEvent<{}>, newValue: any) => {
    setValue(newValue);
  };

  return (
    <>
      <Grid
        container
        alignItems="center"
        direction="column"
        justifyContent="center"
        spacing={2}
      >
        <Grid item>
          <Typography
            align="center"
            variant="h2"
            sx={{ fontFamily: "sans-serif", margin: "15px" }}
          >
            CritIQ
          </Typography>
          <Typography align="center" variant="h6">
            Let CritIQ test your idea
          </Typography>
        </Grid>
        <Grid
          container
          item
          direction="row"
          spacing={1} // you can adjust this value to bring them closer or farther apart
          alignItems="center"
          justifyContent="center"
        >
          <Grid item xs={3} display="flex" justifyContent="center">
            <FormControl fullWidth sx={{ maxWidth: "250px" }}>
              <InputLabel id="idea">Idea</InputLabel>
              <IdeaSelector
                selectedIdeaId={ideaId}
                setSelectedIdeaId={setIdeaId}
              />
            </FormControl>
          </Grid>
          <Grid item xs={3} display="flex" justifyContent="center">
            <FormControl fullWidth sx={{ maxWidth: "250px" }}>
              <InputLabel id="category">Category</InputLabel>
              <Select
                labelId="category"
                id="cat"
                value={Category}
                onChange={handleCategoryChange}
                label="Category"
              >
                <MenuItem value={1}>Product</MenuItem>
                <MenuItem value={2}>Business</MenuItem>
                <MenuItem value={3}>Marketing</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Grid item>
          <FormGroup sx={{ display: "flex", flexDirection: "row" }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={checkedState.angel}
                  onChange={handleCheckboxChange}
                  name="angel"
                />
              }
              label="Angel"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={checkedState.vc}
                  onChange={handleCheckboxChange}
                  name="vc"
                />
              }
              label="VC"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={checkedState.customer}
                  onChange={handleCheckboxChange}
                  name="customer"
                />
              }
              label="Customer"
            />
          </FormGroup>
        </Grid>
        <Grid item>
          <Button variant="contained">Run CritIQ</Button>
        </Grid>
      </Grid>
    </>
  );
}
