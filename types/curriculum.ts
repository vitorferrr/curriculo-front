export type Technology = {
  id: string;
  name: string;
  category: string | null;
};

export type ProfileSummary = {
  id: string;
  name: string;
};

export type Profile = {
  id: string;
  name: string;
  title: string | null;
  email: string;
  phone: string | null;
  location: string | null;
  summary: string | null;
  photoUrl: string | null;
  githubUrl: string | null;
  linkedinUrl: string | null;
  createdAt: string;
  updatedAt: string;
};

export type AcademicExperience = {
  id: string;
  profileId: string;
  institution: string;
  course: string;
  degree: string | null;
  startDate: string;
  endDate: string | null;
  description: string | null;
};

export type ProfessionalExperience = {
  id: string;
  profileId: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string | null;
  description: string | null;
};

export type Project = {
  id: string;
  profileId: string;
  name: string;
  description: string | null;
  repositoryUrl: string | null;
  demoUrl: string | null;
  imageUrl: string | null;
  technologies: Technology[];
  profile?: ProfileSummary;
};

export type FullProfile = Profile & {
  academicExperiences: AcademicExperience[];
  professionalExperiences: ProfessionalExperience[];
  projects: Project[];
};
