(() => {
  const quizText = window.APP_TEXT?.it?.content?.quiz ?? {};

  window.QUIZ_FLOW = {
    startQuestionId: "p1",
    primary: ["p1", "p2", "p3", "p4", "p5", "p6", "p7", "p8", "p9", "p10"],
    branches: {
      a: ["a_1", "a_2", "a_3", "a_7", "a_8", "a_9", "a_13", "a_14", "a_15", "a_19", "a_20", "a_21", "a_22", "a_23", "a_24", "a_25", "a_26", "a_27"],
      c: ["c_1", "c_2", "c_3", "c_4", "c_5", "c_6", "c_7", "c_8", "c_9", "c_10", "c_11", "c_12", "c_13", "c_14", "c_15", "c_16", "c_17", "c_18", "c_19", "c_20", "c_21", "c_25", "c_26", "c_27"],
      cu: ["cu_4", "cu_5", "cu_6", "cu_16", "cu_17", "cu_18", "cu_19", "cu_20", "cu_21", "cu_22", "cu_23", "cu_24", "cu_28"],
      d: ["d_1", "d_2", "d_3", "d_4", "d_5", "d_6", "d_7", "d_8", "d_9", "d_10", "d_11", "d_12", "d_13", "d_14", "d_15", "d_16", "d_17", "d_18", "d_19", "d_20", "d_21", "d_22", "d_23", "d_24", "d_25", "d_26", "d_27"],
      e: ["e_1", "e_2", "e_3", "e_4", "e_5", "e_6", "e_7", "e_8", "e_9", "e_10", "e_11", "e_12", "e_13", "e_14", "e_15", "e_16", "e_17", "e_18", "e_22", "e_23", "e_24", "e_25", "e_26", "e_27"]
    }
  };

  function normalizeAnswer(answer, question) {
    if (typeof answer === "string") {
      return {
        label: answer,
        nextId: question.nextId,
        feedback: question.feedback
      };
    }

    return {
      label: answer.label || "",
      nextId: answer.nextId ?? question.nextId,
      feedback: answer.feedback ?? question.feedback
    };
  }

  function normalizeQuestion(questionId, question) {
    return {
      id: questionId,
      text: question.prompt || question.text || "",
      answers: (question.answers || []).map((answer) => normalizeAnswer(answer, question))
    };
  }

  const orderedQuestionIds = [...window.QUIZ_FLOW.primary, ...Object.values(window.QUIZ_FLOW.branches).flat()];
  const questionsById = quizText.questionsById ?? {};

  window.QUIZ_CONTENT = {
    introTitle: quizText.introTitle ?? "",
    introText: quizText.introText ?? "",
    tapToContinueLabel: quizText.tapToContinueLabel ?? "",
    startQuestionId: window.QUIZ_FLOW.startQuestionId,
    completion: quizText.completion ?? {},
    questions: orderedQuestionIds.map((questionId) => normalizeQuestion(questionId, questionsById[questionId] ?? {}))
  };
})();
