import Card from "../components/courses/card";
import Navbar from "../components/navbar";

const CoursesDetailPage = () => {
  const dummyArray = [
    "Become an advanced, confident, and modern JavaScript developer from scratch",
    "JavaScript fundamentals: variables, if / else, operators, boolean logic, functions, arrays, objects, loops, strings, etc.",
    "Object Oriented Programming",
    "Modern ES6+ from the beginning",
    "Practice your skills with 20+ challenges and assignments (solutions included)",
    "Modern tools for 2022 and beyond: NPM, Parcel, Babel and ES6 modules",
  ];
  const dummySyllabus = [
    "6 coding assignments",
    "Three PDF containing learning materials",
  ];

  const outline = dummyArray.map((item, index) => {
    return (
      <li key={index} className="my-2">
        {item}
      </li>
    );
  });
  return (
    <>
      <Navbar isLoggedIn={false} />
      <div className="bg-secondary px-40 pt-20 pb-5">
        <h1 className="font-nunito font-bold text-4xl mx-5 pt-10 text-primary">
          Introduction to Javascript
        </h1>
        <div className="flex flex-row w-[50%]">
          <p className="font-nunito font-bold text-lg text-primary mx-5 py-5">
            This course provides a foundational understanding of JavaScript, an
            essential programming language for web development. The course also
            covers DOM manipulation, event handling, and basic debugging
            techniques.
          </p>
        </div>
        <div className="flex flex-row font-bold text-primary space-x-20 mx-5">
          <p>Difficulty: Beginner</p>
          <p>Duration: 4 hours</p>
          <p>Instructor: Sherly</p>
        </div>
      </div>
      <div className="flex md:flex-row flex-col-reverse">
        <div className=" border-black border-2 px-5 py-4 m-5 ml-[25vh] w-full order-2 md:order-1">
          <h1 className="font-nunito font-bold text-2xl">
            What you’ll learn from this course
          </h1>
          <ul
            className="font-nunito font-bold"
            style={{ listStyleType: "disc", paddingLeft: "20px" }}
          >
            {outline}
          </ul>
        </div>
        <div className="px-5 py-4 m-5 w-full order-1 md:order-2 z-10"></div>
      </div>
      <div className="px-5 py-4 m-5 w-[50%]">
        <Card
          price={550000}
          isLogin={false}
          averageRating={4.2}
          syllabus={dummySyllabus}
        />
      </div>
    </>
  );
};

export default CoursesDetailPage;
