import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/../hooks/use-toast";

export function AddCar({ children, mode, carEdit }) {
  const [company, setCompany] = useState("");
  const [model, setModel] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [allTags, setAllTags] = useState("");
  const { toast } = useToast();
  const maxImages = 10;

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFiles = e.target.files;
    const validImages = [];

    // Loop through selected files
    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];

      // Allow only JPEG and PNG images, and limit to maxImages
      if (
        (file.type === "image/jpeg" || file.type === "image/png") &&
        validImages.length < maxImages
      ) {
        validImages.push(file);
      }
    }

    setImages(validImages); // Update the state with valid files
  };

  // Handle input changes for company, model, description
  const handleInputChange = (e, setter) => {
    setter(e.target.value);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare form data
    const formData = new FormData();
    formData.append("company", company);
    formData.append("model", model);
    formData.append("description", description);
    formData.append("tags", allTags); // Send tags as a JSON string
    // Loop through images and append them to FormData
    if (mode !== "edit") {
      images.forEach((image) => {
        formData.append("images", image); // Each image is added with the same key 'images'
      });
    }
    // Send POST request with Bearer token
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND}${
          mode === "edit"
            ? `/service/car/update/${carEdit._id}`
            : "/service/car/add"
        }`,
        {
          method: mode === "edit" ? "PUT" : "POST",
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`, // Get the token from sessionStorage
          },
          body: formData, // Send the FormData
        }
      );

      if (response.ok) {
        // Successfully added the car
        toast({
          title: mode === "edit" ? "Car Updated" : "Car Added",
          description: mode === "edit" ? "Car details updated!" : "Added new car!",
        });
        // Reset the form fields
        setCompany("");
        setModel("");
        setDescription("");
        setAllTags([]);
        setImages([]);
        // Refresh the page
        window.location.reload();
      } else {
        throw new Error("Failed to add the car.");
      }
    } catch (error) {
      toast({
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      });
    }
  };

  // Handle adding tags
  const handleTagsChange = (e) => {
    setAllTags(e.target.value);
  };

  useEffect(() => {
    if (mode === "edit") {        
      setCompany(carEdit.company);
      setModel(carEdit.model);
      setDescription(carEdit.description);
      setAllTags(carEdit.tags?.join(","));
      setImages(carEdit.images);
    }
  }, [mode]);

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "edit" ? "Edit car details" : "Add a car"}
          </DialogTitle>
          <DialogDescription>
            {mode === "edit"
              ? "Make changes to edit car details"
              : "Make changes to add your car"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          {/* Company Input */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="company" className="text-right">
              Company
            </Label>
            <Input
              id="company"
              placeholder="Maruti Suzuki"
              value={company}
              onChange={(e) => handleInputChange(e, setCompany)}
              className="col-span-3"
            />
          </div>

          {/* Model Input */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="model" className="text-right">
              Model
            </Label>
            <Input
              id="model"
              placeholder="Wagon R"
              value={model}
              onChange={(e) => handleInputChange(e, setModel)}
              className="col-span-3"
            />
          </div>

          {/* Description Input */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Description of the car"
              value={description}
              onChange={(e) => handleInputChange(e, setDescription)}
              className="col-span-3"
            />
          </div>

          {/* Image Input */}
          {mode !== "edit" && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="images" className="text-right">
                Images
              </Label>
              <Input
                id="images"
                type="file"
                multiple
                accept="image/jpeg" // Only allows JPEG images
                onChange={handleFileChange}
                placeholder="Choose images"
                className="col-span-3"
              />
              <div className="col-span-4 mt-2">
                {/* Display the selected image filenames */}
                <ul className="flex justify-end space-x-2 flex-wrap">
                  {images.map((image, index) => (
                    <li
                      key={index}
                      className="border p-1 text-sm text-gray-600">
                      {image.name}
                    </li>
                  ))}
                </ul>
                {images.length >= maxImages && (
                  <p className="text-red-500 text-xs">
                    You can only upload up to {maxImages} images.
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="tags" className="text-right">
              Tags
            </Label>
            <Input
              id="tags"
              placeholder="Enter tags, separated by commas"
              value={allTags}
              onChange={handleTagsChange}
              className="col-span-3"
              type="text"
            />
          </div>

          {/* Dialog Footer with Save Button */}
          <DialogFooter>
            <Button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700">
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
