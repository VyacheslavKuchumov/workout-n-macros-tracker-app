from django.db import migrations


def seed_muscle_groups(apps, schema_editor):
    MuscleGroup = apps.get_model("training", "MuscleGroup")
    groups = [
        ("Chest", "chest", "Pressing work and pec-focused exercises", 1),
        ("Back", "back", "Rows, pull-downs, and pull-up variations", 2),
        ("Legs", "legs", "Squats, hinges, lunges, and leg accessories", 3),
        ("Shoulders", "shoulders", "Overhead presses and delt isolation", 4),
        ("Arms", "arms", "Biceps, triceps, and forearm work", 5),
        ("Core", "core", "Abs, obliques, and bracing exercises", 6),
        ("Cardio", "cardio", "Conditioning and endurance sessions", 7),
        ("Full Body", "full-body", "Whole-body compound training", 8),
    ]

    for name, slug, description, ordering in groups:
        MuscleGroup.objects.update_or_create(
            slug=slug,
            defaults={
                "name": name,
                "description": description,
                "ordering": ordering,
            },
        )


def noop(apps, schema_editor):
    return None


class Migration(migrations.Migration):
    dependencies = [
        ("training", "0001_initial"),
    ]

    operations = [
        migrations.RunPython(seed_muscle_groups, noop),
    ]
