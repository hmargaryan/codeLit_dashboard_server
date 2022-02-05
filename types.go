type User struct {
	ID int64
	Name string
	Surname string
	Login string
	Email string
	Password string
	interviewsCounter int64
	Role Role
	Candidates []Candidate
	Templates []Template
}

type Role struct {
	ID 		int64
	Name 	string
}

type Candidate struct {
	ID int64
	Name string
	Surname string
	Email string
	Resume string
	Status string
	Vacancy Vacancy
	Review Review
}

type Vacancy struct {
	ID 						int64
	Name 					string
	Description 	string
	Stages 				int64
}

type Review struct {
	ID 					int64
	Points 			int64
	Result 			Result
	Feedbacks 	[]Feedback 
}

type Result struct {
	ID 		int64
	Name 	string
}

type Feedback struct {
	ID 						int64
	Text 					string
	QuestionID 		int64
}

type Template struct {
	ID 					int64
	Name 				string
	Questions 	[]Question
}

type Question stuct {
	ID 				int64
	Text 			string
	Template 	string
	Solution 	string
}