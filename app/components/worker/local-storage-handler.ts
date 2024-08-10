export const getCourses = async (id: any) => {
  try {
    const response = await fetch(`/api/course/${id}`, {
      method: "GET",
      headers: {
        accept: "application/json",
      },
    });
    const data = await response.json();
    const materialData = data.data.materials.map((material: any) => material.title);
    const assignmentData = data.data.assignments.map((assignment: any) => assignment.title);
    localStorage.setItem('materialData', JSON.stringify(materialData));
    localStorage.setItem('assignmentData', JSON.stringify(assignmentData));
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
    const materialData: string[] = materialDataString ? JSON.parse(materialDataString) : [];
    const assignmentData: string[] = assignmentDataString ? JSON.parse(assignmentDataString) : [];
    return {materialData, assignmentData};
  }
  else {
    return undefined;
  }
}