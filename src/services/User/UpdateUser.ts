import { v2 as cloudinary } from 'cloudinary';
import User from '../../models/user.model';

export const AddProfilePicture = async (
  userId: string,
  filePath: string,
): Promise<string> => {
  if (!filePath) {
    throw new Error('No file uploaded');
  }

  const result = await cloudinary.uploader.upload(filePath, {
    folder: 'profile_pics',
    transformation: [{ quality: 'auto' }],
  });

  const profilePicUrl = result.secure_url;
  await User.findByIdAndUpdate(userId, { profile_picture: profilePicUrl });

  return profilePicUrl;
};
