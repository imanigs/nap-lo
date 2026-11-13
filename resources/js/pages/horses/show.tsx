import { Head, Link, usePage } from '@inertiajs/react';
import { History, IdCard, NotebookText, Ruler } from 'lucide-react';
import { route } from 'ziggy-js';
import ExerciseLog from '@/components/custom/exercise-log';
import FeedLog from '@/components/custom/feed-log';
import HealthLog from '@/components/custom/health-log';
import HorseHeader from '@/components/custom/horse-header';
import HorseMeasurements from '@/components/custom/horse-measurements';
import ObservationLog, {
    ObservationChip,
    observationValues,
} from '@/components/custom/observation-log';
import ProfileTabs from '@/components/custom/profile-tabs';
import SectionTabs from '@/components/custom/section-tabs';
import { buttonVariants } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { KINDS } from '@/lib/log-entry';
import type { Exercise, ExerciseCategoryOption, ExerciseIntensityOption } from '@/types/exercise';
import type { FeedCategoryOption, FeedRoutine, FeedUnitOption } from '@/types/feed';
import type { HealthCategoryOption, HealthRecord, HealthRepeatUnitOption } from '@/types/health';
import type { Horse } from '@/types/horse';
import type { Measurement } from '@/types/measurement';
import type { ObservationRatings, Observation } from '@/types/observation';

export default function Show() {
    const {
        horse,
        abilities,
        measurement,
        feedRoutines,
        feedCategories,
        feedUnits,
        exerciseMonth,
        exercises,
        exerciseCategories,
        exerciseIntensities,
        healthRecords,
        healthCategories,
        healthRepeatUnits,
        observations,
        observationRatings,
    } = usePage<{
        horse: Horse;
        abilities: string[];
        measurement: Measurement;
        exerciseMonth: string;
        exercises: Exercise[];
        exerciseCategories: ExerciseCategoryOption[];
        exerciseIntensities: ExerciseIntensityOption[];
        healthRecords: HealthRecord[];
        healthCategories: HealthCategoryOption[];
        healthRepeatUnits: HealthRepeatUnitOption[];
        observations: Observation[];
        observationRatings: ObservationRatings;
        feedRoutines: FeedRoutine[];
        feedCategories: FeedCategoryOption[];
        feedUnits: FeedUnitOption[];
    }>().props;

    const latestObservation = observations[0]
        ? observationValues(observations[0]).filter((item) => item.text)
        : [];

    return (
        <div className="mx-auto max-w-4xl space-y-3 p-4 sm:p-8">
            <Head title={horse.name} />
            <HorseHeader
                horse={horse}
                canEdit={abilities.includes('edit_profile')}
                actions={
                    abilities.includes('view_profile') && (
                        <Link
                            href={route('horses.history', horse.id)}
                            aria-label="Napló"
                            title="Napló"
                            className={buttonVariants({ variant: 'outline', size: 'icon' })}
                        >
                            <History className="size-5" strokeWidth={1.5} />
                        </Link>
                    )
                }
            >
                <ProfileTabs
                    tabs={[
                        {
                            key: 'profile',
                            label: 'Adatlap',
                            icon: IdCard,
                            content: (
                                <div className="space-y-1.5">
                                    <p>
                                        <strong>Nem:</strong> {horse.gender}
                                    </p>
                                    <p>
                                        <strong>Születési dátum:</strong> {horse.birth_date || '-'}
                                    </p>
                                    <p>
                                        <strong>Fajta:</strong> {horse.breed || '-'}
                                    </p>

                                    {latestObservation.length > 0 && (
                                        <>
                                            <Separator />
                                            {latestObservation.map((item) => (
                                                <p
                                                    key={item.label}
                                                    className="flex items-center gap-2"
                                                >
                                                    <strong>{item.label}:</strong>
                                                    <ObservationChip item={item} />
                                                </p>
                                            ))}
                                        </>
                                    )}
                                </div>
                            ),
                        },
                        {
                            key: 'measurements',
                            label: 'Méretek',
                            icon: Ruler,
                            content: <HorseMeasurements measurement={measurement} />,
                        },
                        {
                            key: 'notes',
                            label: 'Jegyzetek',
                            icon: NotebookText,
                            content: <p className="whitespace-pre-line">{horse.notes || '-'}</p>,
                        },
                    ]}
                />
            </HorseHeader>

            <SectionTabs
                tabs={[
                    {
                        key: 'feed',
                        label: KINDS.feed.label,
                        icon: KINDS.feed.icon,
                        visible: abilities.includes('view_feed'),
                        content: (
                            <FeedLog
                                horseId={horse.id}
                                routines={feedRoutines}
                                canEdit={abilities.includes('edit_feed')}
                                categories={feedCategories}
                                units={feedUnits}
                            />
                        ),
                    },
                    {
                        key: 'exercise',
                        label: KINDS.exercise.label,
                        icon: KINDS.exercise.icon,
                        visible: abilities.includes('view_exercise'),
                        content: (
                            <ExerciseLog
                                horseId={horse.id}
                                month={exerciseMonth}
                                exercises={exercises}
                                canEdit={abilities.includes('edit_exercise')}
                                categories={exerciseCategories}
                                intensities={exerciseIntensities}
                            />
                        ),
                    },
                    {
                        key: 'health',
                        label: KINDS.health.label,
                        icon: KINDS.health.icon,
                        visible: abilities.includes('view_health'),
                        content: (
                            <HealthLog
                                horseId={horse.id}
                                records={healthRecords}
                                canEdit={abilities.includes('edit_health')}
                                categories={healthCategories}
                                repeatUnits={healthRepeatUnits}
                            />
                        ),
                    },
                    {
                        key: 'observation',
                        label: KINDS.observation.label,
                        icon: KINDS.observation.icon,
                        visible: abilities.includes('view_observation'),
                        content: (
                            <ObservationLog
                                horseId={horse.id}
                                records={observations}
                                canEdit={abilities.includes('edit_observation')}
                                ratings={observationRatings}
                            />
                        ),
                    },
                ]}
            />
        </div>
    );
}
