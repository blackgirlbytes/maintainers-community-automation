import { Probot } from 'probot';

function bot(app: Probot) {
// if issue is labeled, 'approved', invite the author to the repo
  app.on('issues.labeled', async context => {
    const { payload } = context;
    const { issue, repository, label } = payload;

    if (label.name === 'approved') {
      const { data: repo } = await context.github.repos.get(context.repo());
      const { data: user } = await context.github.users.getForUser({
        username: issue.user.login,
      });

      await context.github.repos.addCollaborator({
        owner: repository.owner.login,
        repo: repository.name,
        username: issue.user.login,        
        permission: 'push',
      });

      await context.github.issues.createComment(
        context.issue({
          body: `@${issue.user.login} invited to the repo`,
        })
      );
    }
  });
}

export default bot;
