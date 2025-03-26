import { useForm, Controller } from "react-hook-form";
import { useState } from "react";

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export default function AvailabilityPage() {
  const { control, handleSubmit, watch, setValue } = useForm({
    defaultValues: {
      availability: daysOfWeek.reduce((acc, day) => {
        acc[day] = { working: false, startTime: "", endTime: "" };
        return acc;
      }, {}),
    },
  });

  const [errors, setErrors] = useState({});
  const availability = watch("availability");

  const handleStartTimeChange = (day, value) => {
    setValue(`availability.${day}.startTime`, value);
    const endTime = availability[day]?.endTime;
    if (endTime && endTime < value) {
      setValue(`availability.${day}.endTime`, "");
    }
  };

  const handleEndTimeChange = (day, value) => {
    if (!availability[day]?.startTime) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [day]: "Start time must be selected before end time.",
      }));
      return;
    }
    if (value < availability[day]?.startTime) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [day]: "End time must be after start time.",
      }));
    } else {
      setErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        delete newErrors[day];
        return newErrors;
      });
      setValue(`availability.${day}.endTime`, value);
    }
  };

  const handleDayToggle = (day, value) => {
    setValue(`availability.${day}.working`, value);
    if (!value) {
      setValue(`availability.${day}.startTime`, "");
      setValue(`availability.${day}.endTime`, "");
      setErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        delete newErrors[day];
        return newErrors;
      });
    }
  };

  const validateForm = (data) => {
    let newErrors = {};
    let isValid = true;

    for (const day of daysOfWeek) {
      if (data.availability[day].working) {
        if (
          !data.availability[day].startTime ||
          !data.availability[day].endTime
        ) {
          newErrors[day] = "Both start time and end time must be selected.";
          isValid = false;
        } else if (
          data.availability[day].endTime < data.availability[day].startTime
        ) {
          newErrors[day] = "End time must be after start time.";
          isValid = false;
        }
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const onSubmit = (data) => {
    if (validateForm(data)) {
      console.log("Availability Submitted:", data);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Set Your Availability</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        {daysOfWeek.map((day) => (
          <div key={day} className="mb-4 p-3 border rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-medium">{day}</span>
              <Controller
                name={`availability.${day}.working`}
                control={control}
                render={({ field }) => (
                  <input
                    type="checkbox"
                    checked={field.value}
                    onChange={(e) => handleDayToggle(day, e.target.checked)}
                    className="w-5 h-5"
                  />
                )}
              />
            </div>
            {errors[day] && (
              <p className="text-red-500 text-sm">{errors[day]}</p>
            )}
            {availability[day]?.working && (
              <div className="flex gap-4 mt-2">
                <Controller
                  name={`availability.${day}.startTime`}
                  control={control}
                  render={({ field }) => (
                    <div className="w-full">
                      <label>Start Time</label>
                      <div
                        className="rounded w-full cursor-pointer"
                        onClick={(e) =>
                          e.currentTarget.querySelector("input").showPicker()
                        }
                      >
                        <input
                          type="time"
                          value={field.value || ""}
                          onChange={(e) =>
                            handleStartTimeChange(day, e.target.value)
                          }
                          className="w-full bg-transparent outline-none"
                        />
                      </div>
                    </div>
                  )}
                />
                <Controller
                  name={`availability.${day}.endTime`}
                  control={control}
                  render={({ field }) => (
                    <div className="w-full">
                      <label>End Time</label>
                      <div
                        className="rounded w-full cursor-pointer"
                        onClick={(e) =>
                          e.currentTarget.querySelector("input").showPicker()
                        }
                      >
                        <input
                          type="time"
                          value={field.value || ""}
                          onChange={(e) =>
                            handleEndTimeChange(day, e.target.value)
                          }
                          className="w-full bg-transparent outline-none"
                        />
                      </div>
                    </div>
                  )}
                />
              </div>
            )}
          </div>
        ))}
        <button
          type="submit"
          className={`w-full mt-4 py-2 rounded ${
            Object.keys(errors).length > 0
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#1E40AF] text-white hover:bg-blue-600"
          }`}
          disabled={Object.keys(errors).length > 0}
        >
          Save Availability
        </button>
      </form>
    </div>
  );
}
