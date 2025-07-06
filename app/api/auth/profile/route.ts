import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import User from '@/models/User';
import { handleApiError } from '@/lib/utils';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { z } from 'zod';
import { uploadBufferToCloudinary } from '../register/cloudinary-upload'; // ✅ New import for buffer upload
import { readFile } from 'fs/promises'; // ✅ Node.js function to read files as buffer

// ✅ Zod schema to validate incoming profile update data
const profileUpdateSchema = z.object({
  name: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  avatar: z.object({
    tempFilePath: z.string().min(1).optional(),
    url: z.string().url().optional(),
  }).optional(),
});

export async function PUT(req: NextRequest) {
  try {
    await connectToDatabase();

    // ✅ Get the user session to ensure the user is authenticated
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // ✅ Parse and validate the request body
    const body = await req.json();
    const validationResult = profileUpdateSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json({ error: validationResult.error.errors[0].message }, { status: 400 });
    }

    const { name, phone, address, avatar } = validationResult.data;

    // ✅ We will store Cloudinary upload result in this object
    let avatarObj = undefined;

    if (avatar) {
      // ✅ If avatar URL is already provided, use it directly
      if (avatar.url) {
        avatarObj = { url: avatar.url };

      // ✅ Else, if we have a temp file path, read the file and upload to Cloudinary
      } else if (avatar.tempFilePath) {
        try {
          // ✅ Read the file from the temp path into a buffer
          const buffer = await readFile(avatar.tempFilePath);

          // ✅ Upload the buffer to Cloudinary (passing buffer + a filename)
          const cloudinaryResponse = await uploadBufferToCloudinary(buffer, 'avatar.jpg');

          // ✅ Handle success response from Cloudinary
          avatarObj = {
            public_id: cloudinaryResponse.publicId, // ⚠️ Make sure this matches your cloud upload function
            url: cloudinaryResponse.url,
          };
        } catch (error) {
          // ❌ If any error happens while reading or uploading the avatar
          return NextResponse.json({ error: 'Failed to upload avatar' }, { status: 500 });
        }
      }
    }

    // ✅ Build the update object only with provided fields
    const update: Record<string, unknown> = {};
    if (name) update.name = name;
    if (phone) update.phone = phone;
    if (address) update.address = address;
    if (avatarObj) update.avatar = avatarObj;

    // ✅ Update the user in the database
    const user = await User.findOneAndUpdate(
      { email: session.user.email },
      { $set: update },
      { new: true }
    );

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // ✅ Clean the user object before sending back (e.g., remove password)
    const userObj = user.toObject();
    delete (userObj as { password?: string }).password;

    // ✅ Return the updated user object
    return NextResponse.json(userObj, { status: 200 });

  } catch (error) {
    // ✅ Fallback error handling
    const { status, body } = handleApiError(error, 'Profile Update');
    return NextResponse.json(body, { status });
  }
}
