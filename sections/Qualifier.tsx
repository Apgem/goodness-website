"use client";

import { useEffect, useId, useRef, useState } from "react";
import Section from "@/components/ui/Section";
import { RevealText, Reveal } from "@/components/ui/RevealText";
import { ButtonWithIcon } from "@/components/ui/button-with-icon";
import { scrollToSection } from "@/components/providers/SmoothScrollProvider";
import { qualifier, site } from "@/lib/content";

const TOTAL_STEPS = qualifier.steps.length;

type Outcome = keyof typeof qualifier.outcomes;

function outcomeFor(score: number): Outcome {
  if (score >= 9) return "good";
  if (score >= 5) return "maybe";
  return "decline";
}

export default function Qualifier() {
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(
    () => Array(TOTAL_STEPS).fill(null),
  );
  const [done, setDone] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const groupId = useId();

  const isLastStep = stepIndex === TOTAL_STEPS - 1;
  const step = qualifier.steps[stepIndex];
  const canAdvance = answers[stepIndex] !== null;

  // Move focus to the step/outcome heading whenever either changes, and
  // announce it — a multi-step form that silently swaps content under a
  // sighted user's cursor leaves a screen-reader user stranded on stale copy.
  useEffect(() => {
    headingRef.current?.focus();
  }, [stepIndex, done]);

  function selectOption(score: number) {
    setAnswers((prev) => {
      const next = [...prev];
      next[stepIndex] = score;
      return next;
    });
  }

  function goNext() {
    if (!canAdvance) return;
    if (isLastStep) {
      setDone(true);
      return;
    }
    setStepIndex((i) => i + 1);
  }

  function goBack() {
    if (done) {
      setDone(false);
      return;
    }
    setStepIndex((i) => Math.max(0, i - 1));
  }

  function restart() {
    setAnswers(Array(TOTAL_STEPS).fill(null));
    setStepIndex(0);
    setDone(false);
  }

  const score = answers.reduce((sum: number, a) => sum + (a ?? 0), 0);
  const outcomeKey = outcomeFor(score);
  const outcome = qualifier.outcomes[outcomeKey];

  return (
    <Section id="qualifier" label={qualifier.label}>
      <h2 className="text-display display max-w-[20ch]">
        <RevealText as="span" text={qualifier.headline} stagger={0.06} />
      </h2>
      <Reveal>
        <p className="mt-8 max-w-[52ch] leading-relaxed text-muted">
          {qualifier.sub}
        </p>
      </Reveal>

      <Reveal delay={0.1}>
        <div className="mt-12 max-w-[42rem] rounded-card border border-line bg-surface/60 p-8 backdrop-blur-sm sm:p-10">
          {/* Progress — visual bar plus a polite live region so step changes
              are announced without yelling every keystroke at a screen reader. */}
          <div className="mb-8 flex items-center gap-3">
            <div
              className="h-1 flex-1 overflow-hidden rounded-full bg-line"
              role="progressbar"
              aria-valuemin={1}
              aria-valuemax={TOTAL_STEPS}
              aria-valuenow={done ? TOTAL_STEPS : stepIndex + 1}
              aria-label="Qualifier progress"
            >
              <div
                className="h-full rounded-full bg-accent transition-[width] duration-500 ease-expo"
                style={{
                  width: `${((done ? TOTAL_STEPS : stepIndex + 1) / TOTAL_STEPS) * 100}%`,
                }}
              />
            </div>
            <span className="shrink-0 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-faint">
              {done ? "Result" : `Step ${stepIndex + 1} of ${TOTAL_STEPS}`}
            </span>
          </div>

          <div aria-live="polite">
            {!done ? (
              <fieldset key={step.id}>
                <legend className="sr-only">{step.question}</legend>
                <h3
                  ref={headingRef}
                  tabIndex={-1}
                  className="text-xl font-medium text-ink outline-none"
                >
                  {step.question}
                </h3>

                <div className="mt-6 flex flex-col gap-3" role="radiogroup">
                  {step.options.map((opt) => {
                    const inputId = `${groupId}-${step.id}-${opt.label}`;
                    const checked = answers[stepIndex] === opt.score;
                    return (
                      <label
                        key={opt.label}
                        htmlFor={inputId}
                        className="group relative block cursor-pointer rounded-control border border-line bg-bg px-5 py-4 text-sm text-ink transition-colors duration-200 has-[:checked]:border-accent has-[:checked]:bg-accent-dim has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-accent"
                      >
                        <input
                          type="radio"
                          id={inputId}
                          name={`qualifier-${step.id}`}
                          className="sr-only"
                          checked={checked}
                          onChange={() => selectOption(opt.score)}
                        />
                        {opt.label}
                      </label>
                    );
                  })}
                </div>

                <div className="mt-8 flex items-center gap-4">
                  {stepIndex > 0 ? (
                    <button
                      type="button"
                      onClick={goBack}
                      className="font-mono text-xs uppercase tracking-[0.14em] text-muted transition-colors hover:text-ink"
                    >
                      ← Back
                    </button>
                  ) : null}
                  <button
                    type="button"
                    onClick={goNext}
                    disabled={!canAdvance}
                    className="ml-auto inline-flex items-center justify-center rounded-control bg-accent px-7 py-3.5 font-mono text-xs uppercase tracking-[0.14em] text-bg transition-colors duration-300 ease-expo hover:bg-ink disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {isLastStep ? "See result" : "Next"}
                  </button>
                </div>
              </fieldset>
            ) : (
              <div role="status">
                <h3
                  ref={headingRef}
                  tabIndex={-1}
                  className="display text-2xl outline-none"
                >
                  {outcome.heading}
                </h3>
                <p className="mt-4 leading-relaxed text-muted">{outcome.body}</p>

                <div className="mt-8 flex flex-wrap items-center gap-4">
                  {outcomeKey === "decline" ? (
                    <ButtonWithIcon onClick={() => (window.location.href = `mailto:${site.email}`)}>
                      {outcome.cta}
                    </ButtonWithIcon>
                  ) : (
                    <ButtonWithIcon onClick={() => scrollToSection("#contact")}>
                      {outcome.cta}
                    </ButtonWithIcon>
                  )}
                  <button
                    type="button"
                    onClick={restart}
                    className="font-mono text-xs uppercase tracking-[0.14em] text-muted transition-colors hover:text-ink"
                  >
                    Start over
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
