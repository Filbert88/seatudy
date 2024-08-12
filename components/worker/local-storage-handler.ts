import { AssignmentInterface, MaterialInterface } from "../types/types";

export const getCourses = async (id: any) => {
  try {
    const response = await fetch(`/api/course/${id}`, {
      method: "GET",
      headers: {
        accept: "application/json",
      },
    });
    const data = await response.json();
    const materialData = data.data.materials;
    const assignmentData = data.data.assignments;
    localStorage.setItem('materialData', JSON.stringify(materialData));
    localStorage.setItem('assignmentData', JSON.stringify(assignmentData));
    localStorage.setItem('title', data.data.title);
    localStorage.setItem('id', id ?? '0');
    return data.data;
  } catch (error) {
    console.error(error);
  } 
};

export const getSideBarDataFromLocalStorage = (courseId: any) => {
  if (localStorage.getItem('id') === courseId) {
    const materialDataString = localStorage.getItem('materialData');
    const assignmentDataString = localStorage.getItem('assignmentData');
    const title = localStorage.getItem('title');
    const materialData: MaterialInterface[] = materialDataString ? JSON.parse(materialDataString) : [];
    const assignmentData: AssignmentInterface[] = assignmentDataString ? JSON.parse(assignmentDataString) : [];
    const titleData: string = title ? title : '';
    return {materialData, assignmentData, titleData};
  }
  else {
    return undefined;
  }
}