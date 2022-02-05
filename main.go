package main

import (
    "database/sql"
    "fmt"
    "log"
    "os"

    "github.com/go-sql-driver/mysql"
)

import types "./types"


var db *sql.DB

func main() {
    cfg := mysql.Config{
        User:   os.Getenv("DBUSER"),
        Passwd: os.Getenv("DBPASS"),
        Net:    "tcp",
        Addr:   "127.0.0.1:3306",
        DBName: "recordings",
    }

    var err error
    db, err = sql.Open("mysql", cfg.FormatDSN())
    if err != nil {
        log.Fatal(err)
    }

    pingErr := db.Ping()
    if pingErr != nil {
        log.Fatal(pingErr)
    }

    users, err := getUsers()
    if err != nil {
        log.Fatal(err)
    }
    fmt.Printf("Users found: %v\n", uses)

    user, err := getUserByID(2)
    if err != nil {
        log.Fatal(err)
    }
    fmt.Printf("User found: %v\n", user)
}

func getUsers() ([]types.User, error) {
    var users []types.User

    rows, err := db.Query("SELECT * FROM users")
    if err != nil {
        return nil, fmt.Errorf("getUsers %q: %v", err)
    }
    defer rows.Close()

    for rows.Next() {
        var usr types.User
        if err := rows.Scan(&usr.ID, &usr.Name, &usr.Surname); err != nil {
            return nil, fmt.Errorf("getUsers %q: %v", err)
        }
        users = append(users, usr)
    }
    if err := rows.Err(); err != nil {
        return nil, fmt.Errorf("getUsers %q: %v", err)
    }
    return users, nil
}

func getUserByID(id int64) (types.User, error) {
    var usr types.User

    row := db.QueryRow("SELECT * FROM users WHERE id = ?", id)
    if err := row.Scan(&usr.ID, &usr.Name, &usr.Surname); err != nil {
        if err == sql.ErrNoRows {
            return alb, fmt.Errorf("getUserByID %d: no such user", id)
        }
        return alb, fmt.Errorf("getUserByID %d: %v", id, err)
    }
    return usr, nil
}