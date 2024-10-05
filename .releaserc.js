module.exports = {
  branches: [
    "+([0-9])?(.{+([0-9]),x}).x",
    "master",
    "main",
    "next",
    "next-major",
    {
      name: "beta",
      prerelease: true,
    },
    {
      name: "alpha",
      prerelease: true,
    },
  ],
  plugins: [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    [
      "@semantic-release/npm",
      {
        npmPublish: false,
        tarballDir: "release", // Specifies directory for release tarballs
      },
    ],
    [
      "@semantic-release/changelog",
      {
        changelogFile: "docs/CHANGELOG.md",
      },
    ],
    [
      "@semantic-release/git", // Manages Git releases
      {
        assets: ["docs/CHANGELOG.md", "package.json", "pnpm-lock.yaml"], // Includes important files
        message:
          "chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}", // Customizes the release commit message
      },
    ],
    [
      "@semantic-release/github", // Integrates with GitHub releases
      {
        assets: [
          { path: "build.zip", label: "Build" },
          { path: "docs/CHANGELOG.md", label: "Changelog" },
        ],
      },
    ],
  ],

  repositoryUrl:
    "https://github.com/Occupational-English-Test-OET/template-service",
  tagFormat: "${version}", // Custom tag format
  ci: true, // Ensures the process runs in a CI environment
};
