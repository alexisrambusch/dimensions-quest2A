import type { SkillDef } from "../skillTypes";
import { numberSkills } from "./numbers";
import { letterSkills } from "./letters";

export const ALL_SKILLS: SkillDef[] = [...numberSkills, ...letterSkills];
