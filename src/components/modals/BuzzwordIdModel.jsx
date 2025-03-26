import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";

export function BuzzwordIdModel({ open, setOpen, buzzword_id }) {
  const handleContinue = () => {
    setOpen(!open);
  };
  return (
    <>
      <Dialog open={open}>
        <DialogHeader>This is the URL for Buzzword Session</DialogHeader>
        <DialogBody className="py-0">{`https://platform.itsbuzzmarketing.com/agent-navigation/buzzword-trainee/${buzzword_id}`}</DialogBody>
        <DialogFooter>
          <Button variant="gradient" color="green" onClick={handleContinue}>
            <span>Continue</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}
