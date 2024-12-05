/* eslint-disable react/react-in-jsx-scope */
'use client';

import TeamPredictForm from '../TeamPredictForm';
import { useParams } from 'next/navigation';

export default function TeamPredictFormPage() {
    const params = useParams();
    const teamId = params.id as string;

    return <TeamPredictForm currentTeamId={teamId} />;
}