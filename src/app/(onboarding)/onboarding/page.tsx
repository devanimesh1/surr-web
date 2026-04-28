"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiCallError, api } from "@/lib/api";
import { ME_QUERY_KEY } from "@/lib/hooks/useMe";
import { Button } from "@/components/ui/button";
import { LanguagePicker } from "@/components/onboarding/LanguagePicker";
import { ArtistPicker } from "@/components/onboarding/ArtistPicker";
import type { Language, OnboardingResponse } from "@/types/api";

type Step = "languages" | "artists";

export default function OnboardingPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [step, setStep] = useState<Step>("languages");
  const [languages, setLanguages] = useState<Language[]>([]);
  const [artists, setArtists] = useState<string[]>([]);

  const submit = useMutation<OnboardingResponse, ApiCallError>({
    mutationFn: () => api.submitOnboarding({ languages, artists }),
    onSuccess: (data) => {
      queryClient.setQueryData(ME_QUERY_KEY, {
        user: data.user,
        needsOnboarding: false,
      });
      router.replace("/home");
    },
  });

  if (step === "languages") {
    return (
      <section className="space-y-6" aria-labelledby="onboarding-title">
        <header className="space-y-2">
          <p className="text-sm uppercase tracking-wide text-[var(--color-text-dim)]">
            Step 1 of 2
          </p>
          <h1 id="onboarding-title" className="text-3xl font-semibold tracking-tight">
            What languages do you listen to?
          </h1>
          <p className="text-sm text-[var(--color-text-dim)]">
            Pick at least one. We&apos;ll tune recommendations and search to your picks.
          </p>
        </header>

        <LanguagePicker value={languages} onChange={setLanguages} />

        <div className="flex items-center justify-between pt-4">
          <p className="text-xs text-[var(--color-text-dim)]">{languages.length} selected</p>
          <Button
            type="button"
            disabled={languages.length === 0}
            onClick={() => setStep("artists")}
          >
            Next
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-6" aria-labelledby="onboarding-title-2">
      <header className="space-y-2">
        <p className="text-sm uppercase tracking-wide text-[var(--color-text-dim)]">Step 2 of 2</p>
        <h1 id="onboarding-title-2" className="text-3xl font-semibold tracking-tight">
          Who are your favorite artists?
        </h1>
        <p className="text-sm text-[var(--color-text-dim)]">
          Pick a few — your picks seed your discovery feed.
        </p>
      </header>

      <ArtistPicker value={artists} onChange={setArtists} />

      {submit.isError && (
        <p role="alert" className="text-sm text-[var(--color-danger)]">
          {submit.error?.message ?? "Something went wrong. Try again."}
        </p>
      )}

      <div className="flex items-center justify-between pt-4">
        <Button type="button" variant="ghost" onClick={() => setStep("languages")}>
          Back
        </Button>
        <Button
          type="button"
          disabled={artists.length === 0 || submit.isPending}
          onClick={() => submit.mutate()}
        >
          {submit.isPending ? "Saving…" : "Finish"}
        </Button>
      </div>
    </section>
  );
}
