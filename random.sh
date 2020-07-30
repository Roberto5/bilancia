#!/bin/bash


if test -n "$1"
then
	if test $1 = 'add' 
	then 
	WEIGHT=`expr $WEIGHT + $2`
	fi
fi
echo $WEIGHT

export WEIGHT
