export type WorkExperience = {
  company: string;
  role: string;
  duration: string;
  achievements: string[];
};

export type Education = {
  school: string;
  major: string;
  degree: string;
  duration: string;
};

export type ResumeData = {
  personal_info: {
    name: string;
    contact: string;
  };
  professional_summary: string;
  skills: string[];
  work_experience: WorkExperience[];
  education: Education[];
};
