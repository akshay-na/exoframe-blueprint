module.exports = {
  extends: ["@commitlint/config-conventional"],

  // Define custom rules or override existing ones
  rules: {
    // Scope is always required in commit messages
    "scope-enum": [
      2,
      "always",
      [
        "core",
        "ui",
        "docs",
        "tests",
        "build",
        "ci",
        "chore",
        "refactor",
        "style",
        "perf",
        "feature",
        "fix",
        "revert",
        "deps",
        "misc",
      ],
    ],

    // Subject must not end with a period
    "subject-full-stop": [2, "never"],

    // Header must not exceed 100 characters
    "header-max-length": [2, "always", 100],

    // Body and footer must be separated by a blank line
    "body-leading-blank": [2, "always"],
    "footer-leading-blank": [2, "always"],

    // Enforce sentence case for subject
    "subject-case": [2, "always", "sentence-case"],
  },

  // Custom parser options if needed
  parserPreset: {
    parserOpts: {
      headerPattern: /^(\w*)(?:\(([\w$.\-* ]*)\))?: (.*)$/,
      headerCorrespondence: ["type", "scope", "subject"],
    },
  },

  // Custom prompt configurations for Commitizen
  prompt: {
    messages: {
      skip: ":skip",
      max: "upper %d chars",
      min: "%d chars at least",
      emptyWarning: "cannot be empty",
      upperLimitWarning: "over limit",
      lowerLimitWarning: "below limit",
    },
    questions: {
      type: {
        description: "Select the type of change that you're committing",
        enum: {
          feat: {
            description: "A new feature",
            title: "Features",
            emoji: "✨",
          },
          fix: {
            description: "A bug fix",
            title: "Bug Fixes",
            emoji: "🐛",
          },
          docs: {
            description: "Documentation only changes",
            title: "Documentation",
            emoji: "📚",
          },
          style: {
            description:
              "Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)",
            title: "Styles",
            emoji: "💎",
          },
          refactor: {
            description:
              "A code change that neither fixes a bug nor adds a feature",
            title: "Code Refactoring",
            emoji: "🔨",
          },
          perf: {
            description: "A code change that improves performance",
            title: "Performance Improvements",
            emoji: "🚀",
          },
          test: {
            description: "Adding missing tests or correcting existing tests",
            title: "Tests",
            emoji: "🚨",
          },
          build: {
            description:
              "Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)",
            title: "Builds",
            emoji: "🛠️",
          },
          ci: {
            description:
              "Changes to our CI configuration files and scripts (example scopes: Travis, Circle, BrowserStack, SauceLabs)",
            title: "Continuous Integrations",
            emoji: "⚙️",
          },
          chore: {
            description: "Other changes that don't modify src or test files",
            title: "Chores",
            emoji: "♻️",
          },
          revert: {
            description: "Reverts a previous commit",
            title: "Reverts",
            emoji: "🔙",
          },
        },
      },
      scope: {
        description:
          "What is the scope of this change (e.g., component or file name)",
      },
      subject: {
        description:
          "Write a short, imperative tense description of the change",
      },
      body: {
        description: "Provide a longer description of the change",
      },
      breaking: {
        description: "Are there any breaking changes?",
      },
      footer: {
        description: "List any issues closed by this change",
      },
    },
  },
};
