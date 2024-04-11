import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from "~/utils/supabaseClient";

export default async function mailingList(req: NextApiRequest, res: NextApiResponse) {
  const { email } = req.body;
  
  // Only allow POST method
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Insert the email into the Supabase table
    const { error } = await supabase
      .from('emails') // Replace with your table name
      .insert([{ email: email }]);

    if (error) {
      throw error;
    }

    // Respond with a success message
    return res.status(200).json({ message: 'Subscribed successfully!' });
  } catch (error: any) {
    // Respond with an error message
    console.log(error.message)
    return res.status(500).json({ message: error.message });
  }
}