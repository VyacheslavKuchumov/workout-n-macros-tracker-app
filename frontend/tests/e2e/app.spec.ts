import { expect, test } from '@playwright/test'

test('signs in and navigates through the main tracking pages', async ({ page }) => {
  const user = {
    id: 1,
    username: 'slava',
    email: 'slava@example.com',
    first_name: 'Slava',
    last_name: 'Tester',
    target_weight_kg: '82.00',
    weekly_workout_goal: 4,
    bio: 'Training for consistent progressive overload.'
  }

  const exercises = [
    {
      id: 1,
      name: 'Bench Press',
      notes: 'Pause the first rep.',
      is_archived: false,
      muscle_group: {
        id: 1,
        name: 'Chest',
        slug: 'chest',
        description: 'Pressing work'
      },
      created_at: '2026-03-01T00:00:00Z',
      updated_at: '2026-03-01T00:00:00Z'
    }
  ]

  const workouts = [
    {
      id: 10,
      name: 'Upper Strength',
      workout_date: '2026-03-31',
      focus: 'Heavy bench and rows',
      notes: 'Felt strong all session.',
      total_sets: 3,
      total_volume: 1230,
      exercises: [
        {
          id: 22,
          order: 1,
          notes: 'Keep elbows stacked.',
          exercise: exercises[0],
          sets: [
            { id: 1, order: 1, reps: 8, weight_kg: '80.00' },
            { id: 2, order: 2, reps: 6, weight_kg: '85.00' },
            { id: 3, order: 3, reps: 5, weight_kg: '87.50' }
          ]
        }
      ],
      created_at: '2026-03-31T00:00:00Z',
      updated_at: '2026-03-31T00:00:00Z'
    }
  ]

  const bodyWeights = [
    {
      id: 1,
      entry_date: '2026-03-29',
      weight_kg: '82.40',
      notes: 'Morning weigh-in',
      created_at: '2026-03-29T00:00:00Z',
      updated_at: '2026-03-29T00:00:00Z'
    },
    {
      id: 2,
      entry_date: '2026-03-31',
      weight_kg: '82.10',
      notes: 'After a good night of sleep',
      created_at: '2026-03-31T00:00:00Z',
      updated_at: '2026-03-31T00:00:00Z'
    }
  ]

  await page.route('**/api/**', async (route) => {
    const url = new URL(route.request().url())
    const method = route.request().method()

    if (url.pathname.endsWith('/accounts/token/') && method === 'POST') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          access: 'access-token',
          refresh: 'refresh-token'
        })
      })
      return
    }

    if (url.pathname.endsWith('/accounts/me/')) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(user)
      })
      return
    }

    if (url.pathname.endsWith('/training/dashboard/')) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          summary: {
            total_workouts: 12,
            workouts_this_month: 5,
            upcoming_workouts: 2,
            total_sets_last_30_days: 42,
            latest_body_weight: '82.10'
          },
          recent_workouts: workouts,
          body_weight_series: bodyWeights.map((entry) => ({
            date: entry.entry_date,
            weight_kg: entry.weight_kg
          })),
          exercise_options: [
            {
              id: 1,
              name: 'Bench Press',
              muscle_group_name: 'Chest'
            }
          ],
          exercise_progress: {
            selected_exercise_id: 1,
            selected_exercise_name: 'Bench Press',
            series: [
              { date: '2026-03-12', max_weight: '82.50', max_reps: 8, volume: '980.00' },
              { date: '2026-03-20', max_weight: '85.00', max_reps: 7, volume: '1100.00' },
              { date: '2026-03-31', max_weight: '87.50', max_reps: 5, volume: '1230.00' }
            ]
          }
        })
      })
      return
    }

    if (url.pathname.endsWith('/training/workouts/')) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(workouts)
      })
      return
    }

    if (url.pathname.endsWith('/training/exercises/')) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(exercises)
      })
      return
    }

    if (url.pathname.endsWith('/training/body-weights/')) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(bodyWeights)
      })
      return
    }

    if (url.pathname.endsWith('/training/muscle-groups/')) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            id: 1,
            name: 'Chest',
            slug: 'chest',
            description: 'Pressing work'
          }
        ])
      })
      return
    }

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({})
    })
  })

  await page.goto('/login')
  await page.getByPlaceholder('Your username').fill('slava')
  await page.getByPlaceholder('Your password').fill('StrongPassword123!')
  await page.getByRole('button', { name: 'Open dashboard' }).click()

  await expect(page.getByRole('heading', { name: 'See training consistency, body weight, and load progression in one place.' })).toBeVisible()
  await expect(page.getByText('Bench Press max weight')).toBeVisible()

  await page.getByRole('link', { name: 'Workouts' }).click()
  await expect(page.getByRole('heading', { name: 'Choose a day, plan the exercises, and record every set.' })).toBeVisible()
  await expect(page.getByText('Upper Strength')).toBeVisible()

  await page.getByRole('link', { name: 'Weight' }).click()
  await expect(page.getByRole('heading', { name: 'Keep a clean scale log next to your workout history.' })).toBeVisible()
  await expect(page.getByText('82.10 kg')).toBeVisible()

  await page.getByRole('link', { name: 'Profile' }).click()
  await expect(page.getByRole('heading', { name: 'Keep your account details and training goals current.' })).toBeVisible()
  await expect(page.locator('input[value="Slava"]')).toBeVisible()
})
