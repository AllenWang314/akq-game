FROM golang:alpine as builder
RUN mkdir /akq-game
ADD ./server/ /akq-game
WORKDIR /akq-game
RUN go mod download
RUN go build -o main .
# RUN ./main -e prod
