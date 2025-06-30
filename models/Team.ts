import mongoose, { Schema, model, models } from 'mongoose';

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
}

export interface Team {
  id: string;
  name: string;
  members: TeamMember[];
}

const teamMemberSchema = new Schema<TeamMember>({
  id: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, required: true },
  email: { type: String, required: true },
});

const teamSchema = new Schema<Team>({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  members: { type: [teamMemberSchema], default: [] },
});

const TeamModel = models.Team || model<Team>('Team', teamSchema);
export default TeamModel; 