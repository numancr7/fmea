import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import User from '@/models/User';
import { handleApiError } from '@/lib/utils';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { z } from 'zod';
import { uploadAvatarToCloudinary } from '../register/cloudinary-upload';

const profileUpdateSchema = z.object({
  name: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  avatar: z.object({ tempFilePath: z.string().min(1) }).optional(),
});

export async function PUT(req: NextRequest) {
  try {
    await connectToDatabase();
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const body = await req.json();
    const validationResult = profileUpdateSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json({ error: validationResult.error.errors[0].message }, { status: 400 });
    }
    const { name, phone, address, avatar } = validationResult.data;
    let avatarObj = undefined;
    if (avatar && avatar.tempFilePath) {
      const cloudinaryResponse = await uploadAvatarToCloudinary(avatar.tempFilePath);
      if (!cloudinaryResponse || cloudinaryResponse.error) {
        return NextResponse.json({ error: 'Failed to upload avatar' }, { status: 500 });
      }
      avatarObj = {
        public_id: cloudinaryResponse.public_id,
        url: cloudinaryResponse.secure_url,
      };
    }
    const update: any = {};
    if (name) update.name = name;
    if (phone) update.phone = phone;
    if (address) update.address = address;
    if (avatarObj) update.avatar = avatarObj;
    const user = await User.findOneAndUpdate(
      { email: session.user.email },
      { $set: update },
      { new: true }
    );
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    const userObj = user.toObject();
    delete (userObj as { password?: string }).password;
    return NextResponse.json(userObj, { status: 200 });
  } catch (error) {
    const { status, body } = handleApiError(error, 'Profile Update');
    return NextResponse.json(body, { status });
  }
} 