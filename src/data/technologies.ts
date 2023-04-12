import { Technology } from "src/types";
import {
  ReactLogo,
  SymfonyLogo,
  TypescriptLogo,
  GoLangLogo,
  GraphQLLogo,
  LaravelLogo,
  PythonLogo,
  FastifyLogo,
  NextLogo,
  JavaLogo,
  NestLogo,
} from "../components/Icons";

export const technologies: Technology[] = [
  // Languages
  {
    color: "#007acc",
    icon: TypescriptLogo,
    name: "TypeScript",
    type: "JavaScript Framework",
    useCase: "Types for JavaScript - will save your life when projects expand.",
  },
  {
    color: "#00acd7",
    icon: GoLangLogo,
    name: "Go",
    type: "Backend, System",
    useCase:
      "It makes it easy to build simple, reliable, and efficient software.",
  },
  {
    color: "#1e2933",
    icon: PythonLogo,
    name: "Python",
    type: "Backend, System",
    useCase: "Work quickly and integrate systems more effectively.",
  },
  {
    color: "#fff",
    icon: JavaLogo,
    name: "Java",
    type: "Backend, System",
    useCase:
      "It makes it easy to build simple, reliable, and efficient software.",
  },
  // Libraries
  {
    color: "#232340",
    icon: ReactLogo,
    name: "React",
    type: "Frontend library",
    useCase:
      "Constructing stateful and durable frontends for large and interactive web apps.",
  },
  {
    color: "#fff",
    icon: FastifyLogo,
    name: "Fastify",
    type: "Backend library",
    useCase: "Extremely fast and simple, low-overhead framework to build APIs.",
  },
  {
    color: "#171e26",
    icon: GraphQLLogo,
    name: "GraphQL",
    type: "Query language",
    useCase:
      "Query language for APIs and a runtime for fulfilling those queries with your existing data.",
  },
  // Frameworks
  {
    color: "#fff",
    icon: NextLogo,
    name: "Next.js",
    type: "React Framework",
    useCase:
      "Next.js is a React framework that provides an easy way to build static and server-rendered applications.",
  },
  {
    color: "#181a1c",
    icon: NestLogo,
    name: "NestJS",
    type: "Node.js Framework",
    useCase:
      "A progressive Node.js framework for building efficient, reliable and scalable server-side applications.",
  },
  {
    color: "#FF2D20",
    icon: LaravelLogo,
    name: "Laravel",
    type: "PHP Framework",
    useCase:
      "PHP Framework for Web Artisans, with expressive and elegant syntax.",
  },
  {
    color: "#18171b",
    icon: SymfonyLogo,
    name: "Symfony",
    type: "PHP Framework",
    useCase: "High Performance PHP Framework for Web Development.",
  },
];
