# ZFS Storage Pool Designer

A web-based tool to help visualize and plan ZFS storage pool configurations. This interactive calculator helps users design ZFS pools by providing real-time visualization and capacity calculations.

## Features

- Interactive pool configuration with support for multiple VDEVs
- Support for various RAID configurations (mirror, RAIDZ1/2/3, dRAID1/2/3)
- Hot spare management
- Advanced options (SLOG, L2ARC, ashift)
- Real-time visualization of pool layout
- Dark/light theme support
- Capacity and efficiency calculations
- ZFS command generation

## Technology Stack

- React
- Tailwind CSS

## Important Disclaimer

This tool is a learning project and should be used for educational and planning purposes only. It comes with several important caveats:

- This is not an official ZFS tool and may contain errors or inaccuracies
- All calculations are approximations and may not reflect real-world performance
- The tool may not account for all ZFS features, limitations, or best practices
- Always consult the official OpenZFS documentation and experienced administrators before implementing production storage systems
- The generated commands are templates and should be carefully reviewed and modified for your specific hardware configuration
- No warranty is provided, and the author(s) are not responsible for any data loss or system issues

## Official Resources

For authoritative information about ZFS, please consult:

- [OpenZFS Documentation](https://openzfs.github.io/openzfs-docs/)
- [OpenZFS GitHub Repository](https://github.com/openzfs/zfs)
- [FreeBSD ZFS Documentation](https://docs.freebsd.org/en/books/handbook/zfs/)

## Development

This project is a work in progress and contributions are welcome. Please note that this is a learning project, and the code may not follow all best practices.

### Setup

1. Clone the repository
2. Install dependencies with `npm install`
3. Start the development server with `npm start`

### Contributing

Feel free to open issues or submit pull requests. However, please note that this is a learning project and may not be actively maintained.