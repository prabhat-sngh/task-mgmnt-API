TASK
You have to create following APIs:
1. Create task - input is title, description and due_date with jwt auth token
2. Create sub task - input is task_id
3. Get all user task(with filter like priority, due date and proper pagination etc)
4. Get all user sub tasks (with filter like task_id if passed)
5. Update task- due_date, status-”TODO” or “DONE” can be changed
6. Update subtask - only status can be updated - 0,1
7. Delete task(soft deletion)
8. Delete sub task(soft deletion)

Instructions:
• Proper validation should be there while taking input and authenticating user for 
api calls
• Error handling should be implemented wherever necessary and user friendly 
error should be thrown
• You can use https://jwt.io/ for creating a jwt token with user_id and only 
corresponding decoding logic should be there
• You should also update the corresponding sub tasks in case of task updation 
and deletion
• Sub task model and user table is given, you must make task model accordingly
• Task should also have priority and status (refer below for both)
• You can use postman to demonstrate all the apis
