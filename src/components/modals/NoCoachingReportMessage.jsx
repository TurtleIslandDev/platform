import React from "react";
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Tooltip,
} from "@material-tailwind/react";
 
export function NoCoachingReportMessage({open, setOpen,setShowDummyReport}) {
  const navigate = useNavigate()
    const handleBack = () => {
        navigate(-1)
        setOpen(!open)
    }
    const handleContinue = () => {
        setShowDummyReport((prev)=>!prev)
        setOpen(!open)
    }
  return (
    <>
      <Dialog open={open}>
        <DialogHeader>There are currently no coaching reports to be completed.</DialogHeader>
        <DialogBody className="py-0">
        Please continue to review an exam or review an example, or click back to navigate to homepage.
        </DialogBody>
              <DialogFooter>
              
          <Button
            variant="text"
            color="red"
            onClick={handleBack}
            className="mr-1"
          >
            <span>Back</span>
                      </Button>
               
                 
          <Button variant="gradient" color="green" onClick={handleContinue}>
            <span>Continue</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}