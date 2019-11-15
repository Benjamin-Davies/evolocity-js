use serde::*;
use std::{
    env::args,
    error::Error,
    io::{BufRead, BufReader},
    os::unix::net::UnixStream,
};

fn main() -> Result<(), AnyError> {
    let args: Vec<String> = args().collect();
    if args.len() != 2 {
        panic!("Please specify a sensor key");
    }
    let key = &args[1][..];

    let stream = UnixStream::connect("/tmp/tau-morrow")?;
    let mut reader = BufReader::new(stream);

    match key {
        "battery_voltage" => loop {
            let SensorData {
                battery_voltage, ..
            } = reader.read_data()?;
            let fmt = if battery_voltage < 5. {
                underline(NONE)
            } else if battery_voltage < 24. {
                underline(RED)
            } else if battery_voltage < 25. {
                underline(PURPLE)
            } else {
                underline(BLUE)
            };
            println!("{}{:.2} V", fmt, battery_voltage);
        },
        "current" => loop {
            let SensorData { current, .. } = reader.read_data()?;
            let fmt = if current < 5. {
                underline(GREEN)
            } else if current < 24. {
                underline(YELLOW)
            } else if current < 25. {
                underline(ORANGE)
            } else {
                underline(RED)
            };
            println!("{}{:.2} A", fmt, current);
        },
        "speed" => loop {
            let SensorData { speed, .. } = reader.read_data()?;
            println!("{:.2}", 3.6 * speed);
        },
        _ => panic!("No case for {}", key),
    }
}

#[derive(Serialize, Deserialize, Debug)]
struct SensorData {
    pub hostname: String,
    pub time: String,
    pub current: f64,
    pub voltage: f64,
    pub battery_voltage: f64,
    pub speed: f64,
}

fn underline(color: &str) -> String {
    // {{ == { it has to be escaped
    format!("%{{u{}}}", color)
}
const RED: &str = "#F00";
const ORANGE: &str = "#F70";
const YELLOW: &str = "#FF0";
const GREEN: &str = "#0F7";
const BLUE: &str = "#00F";
const PURPLE: &str = "#D0F";
const NONE: &str = "-";

type AnyError = Box<dyn Error>;

trait ReadData {
    fn read_data(&mut self) -> Result<SensorData, AnyError>;
}

impl<R: BufRead> ReadData for R {
    fn read_data(&mut self) -> Result<SensorData, AnyError> {
        let mut line = String::new();
        self.read_line(&mut line)?;
        line.pop(); // Remove the trailing \n
        Ok(serde_json::from_str(&line)?)
    }
}
