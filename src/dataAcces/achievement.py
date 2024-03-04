class Achievement:
    def __init__(self, name, task,pid):
        self.name = name
        self.task = task
        self.pid = pid

    def to_dct(self):
        return dict(name=self.name, task=self.task, pid=self.pid)


class Quest(Achievement):
    def __init__(self, name, task, pid, deadline):
        super(Achievement, self).__init__(name, task,pid)
        self.deadline = deadline

    def to_dct(self):
        return dict(name=self.name, task=self.task, pid=self.pid, deadline=self.deadline)


class AchievementDataAccess:
    def __init__(self, dbconnect):
        self.dbconnect = dbconnect


class QuestDataAccess:
    def __init__(self, dbconnect):
        self.dbconnect = dbconnect
