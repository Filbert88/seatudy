const Instructions = ({ children }: any) => {
  return (
    <>
      <div className="font-nunito font-regular justify-normal">
        Create a simple to-do list application using JavaScript. The application
        should have the following features: Add New Tasks: Users should be able
        to input a task and add it to the list. Each task should be displayed
        with a checkbox and a delete button. Mark Tasks as Completed: Users
        should be able to mark tasks as completed by checking the checkbox next
        to the task. Completed tasks should have a visual indication, such as a
        line-through style. Remove Tasks: Users should be able to remove tasks
        from the list by clicking the delete button next to the task. This
        assignment will give you experience with DOM manipulation, event
        handling, and basic application structure. You will learn how to
        dynamically create and manipulate HTML elements using JavaScript and
        handle user interactions effectively. Constraints: Input Validation:
        Ensure that the user cannot add an empty task. Display an error message
        if the input field is empty when the user tries to add a task. Unique
        Task IDs: Each task should have a unique identifier to differentiate it
        from other tasks, which will be useful for marking and deleting tasks.
        Persistent Storage: Use the browser's local storage to save the tasks.
        This will allow the tasks to persist even when the page is refreshed or
        the browser is closed and reopened. Responsive Design: Ensure that the
        application is responsive and works well on both desktop and mobile
        devices. Use CSS to style the application and make it visually
        appealing. Code Modularity: Organize your JavaScript code into functions
        to enhance readability and maintainability. Avoid global variables where
        possible. Accessibility: Make sure the application is accessible to all
        users. Implement proper labeling for input fields and buttons, and
        ensure keyboard accessibility for all interactive elements. By
        completing this assignment, you will gain practical experience in
        building interactive web applications using JavaScript, enhancing your
        skills in front-end web development.
      </div>
    </>
  );
};

export default Instructions;
