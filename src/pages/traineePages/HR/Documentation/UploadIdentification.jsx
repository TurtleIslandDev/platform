import { useState } from "react";
import { useForm } from "react-hook-form";

const documentOptions = {
  "LIST A: Documents That Establish Both Identity and Employment Authorization":
    {
      passport: "U.S. passport or U.S. passport card",
      green_card:
        "Form I-551, Permanent Resident Card or Alien Registration Receipt Card (commonly called a Green Card). See Section 7.1, Lawful Permanent Residents for when a Permanent Resident Card is considered unexpired past the 'Card Expires' date.",
      foreign_passport:
        "Foreign passport that contains a temporary I-551 (ADIT) stamp or temporary I-551 printed notation on a machine-readable immigrant visa (MRIV).",
      ead: "Form I-766, Employment Authorization Document (EAD) that contains a photograph. However, in certain circumstances, an EAD past its 'Card Expires' date qualifies as an unexpired EAD. See Section 5.0, Automatic Extensions of Employment Authorization and/or Employment Authorization Documents (EADs) in Certain Circumstances, for more information.",
      i94_passport:
        "For nonimmigrant individuals authorized to work for a specific employer because of their status. This means they are authorized to be employed based on their nonimmigrant status and may present a foreign passport with Form I-94 bearing the same name as the passport and an endorsement of their nonimmigrant status, as long as the period of endorsement has not yet expired and the proposed employment is not in conflict with any restrictions or limitations identified on the form.",
      fsm_rmi_passport:
        "Passport from the Federated States of Micronesia (FSM) or the Republic of the Marshall Islands (RMI) with Form I-94 indicating nonimmigrant admission under the Compact of Free Association Between the United States and the FSM or RMI.",
    },
  "LIST B: Documents That Establish Identity": {
    drivers_license:
      "Driver’s license or ID card issued by a state or outlying possession of the United States, provided it contains a photograph or information such as name, date of birth, gender, height, eye color, and address.",
    govt_id:
      "ID card issued by federal, state, or local government agencies or entities, provided it contains a photograph or information such as name, date of birth, gender, height, eye color, and address (This selection does not include the driver’s license or ID card issued by a state or outlying possession of the United States in Item 1 of this list).",
    school_id: "School ID card with a photograph.",
    voter_card: "Voter’s registration card.",
    military_card: "U.S. military card or draft record.",
    military_dependents_id: "Military dependent’s ID card.",
    merchant_mariner_card: "U.S. Coast Guard Merchant Mariner Card.",
    tribal_document: "Native American tribal document.",
    canadian_license:
      "Driver’s license issued by a Canadian government authority.",
    minor_school_record:
      "School record or report card (for persons under 18 who are unable to present a document listed above).",
    minor_medical_record:
      "Clinic, doctor, or hospital record (for persons under 18 who are unable to present a document listed above).",
    minor_daycare_record:
      "Day care or nursery school record (for persons under 18 who are unable to present a document listed above).",
  },
  "LIST C: Documents That Establish Employment Authorization": {
    ssn_card:
      "A Social Security Account Number card, unless the card includes one of the following restrictions: NOT VALID FOR EMPLOYMENT, VALID FOR WORK ONLY WITH INS AUTHORIZATION, VALID FOR WORK ONLY WITH DHS AUTHORIZATION.",
    birth_report:
      "Certification of report of birth issued by the U.S. Department of State (Forms DS-1350, FS-545, FS-240).",
    birth_certificate:
      "Original or certified copy of a birth certificate issued by a state, county, municipal authority or outlying territory of the United States bearing an official seal.",
    tribal_doc: "Native American tribal document.",
    citizen_id: "U.S. Citizen Identification Card (Form I-197).",
    resident_id:
      "Identification Card for Use of Resident Citizen in the United States (Form I-179).",
    dhs_ead:
      "Employment authorization document issued by the Department of Homeland Security. (This does not include Form I-766, Employment Authorization Document, from List A.)",
  },
};

export default function UploadIdentification() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const [selectedCategory, setSelectedCategory] = useState("");

  const onSubmit = (data) => {
    console.log("Form Data:", data);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-4">Upload Identification</h2>
      <div className="mb-6 text-base text-gray-700">
        <p>Please read the following document categories before uploading:</p>
        {Object.entries(documentOptions).map(([category, docs]) => (
          <div key={category}>
            <h3 className="font-semibold text-black text-xl mt-4">
              {category}
            </h3>
            <p>All documents must be unexpired.</p>
            <ol className="list-decimal pl-6 mt-2">
              {Object.values(docs).map((doc, index) => (
                <li key={index}>{doc}</li>
              ))}
            </ol>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <label className="block text-base font-medium text-gray-700">
          Select Document Category
        </label>
        <select
          {...register("category", { required: "Category is required" })}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full p-2 border rounded-md"
        >
          <option value="">Select a category</option>
          {Object.keys(documentOptions).map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        {errors.category && (
          <p className="text-red-500 text-base">{errors.category.message}</p>
        )}

        {selectedCategory && (
          <div>
            <label className="block text-base font-medium text-gray-700">
              Upload Required Documents
            </label>
            {Object.entries(documentOptions[selectedCategory]).map(
              ([key, doc]) => (
                <div key={key} className="mb-2">
                  <label className="block text-base text-gray-700">{doc}</label>
                  <input
                    type="file"
                    {...register(key, {
                      required: `File for ${doc} is required`,
                    })}
                    className="w-full p-2 border rounded-md"
                  />
                  {errors[key] && (
                    <p className="text-red-500 text-base">
                      {errors[key].message}
                    </p>
                  )}
                </div>
              )
            )}
          </div>
        )}

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
